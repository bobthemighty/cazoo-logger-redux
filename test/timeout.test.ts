import {Context} from 'aws-lambda';
import * as logger from '../src';
import {sink} from './helper';
import {event} from './data/awsgateway';

import {Transform} from 'stream';

const timeout = 100;
const timeNotToTriggerTimeout = 89;
const timeToTriggerTimeout = 91;
const timeToTriggerForUnderLimitTimeout = 11;
const timeoutUnderLimit = 20;

/*
describe('setting up the timeout buffer', () => {
  describe('when not passing a value', () => {
    it('should use the default of 10', () => {
      const expected = 10
      const actual = getTimeoutBuffer()
      expect(actual).toBe(expected)
    })
  })

  describe('when passing a numeric value', () => {
    it('should use the passed numeric value', () => {
      const expected = 5
      process.env.CAZOO_LOGGER_TIMEOUT_BUFFER_MS = '5'
      const actual = getTimeoutBuffer()
      expect(actual).toBe(expected)
    })
  })

  describe('when passing a non-numeric value', () => {
    it('should use the default of 10', () => {
      const expected = 10
      process.env.CAZOO_LOGGER_TIMEOUT_BUFFER_MS = 'd'
      const actual = getTimeoutBuffer()
      expect(actual).toBe(expected)
    })
  })
})
*/

describe('Preemptive logging of lambda timeouts', () => {
  const msg = 'Lambda Timeout';
  const type = 'lambda.timeout';
  const level = 'error';
  const expected = {level, type, msg};
  let stream: Transform;

  beforeEach(() => {
    jest.useFakeTimers();
    stream = sink();
  });

  beforeAll(() => (process.env.CAZOO_ENABLE_TIMEOUT_LOGGING = 'yep'));
  afterAll(() => delete process.env.CAZOO_ENABLE_TIMEOUT_LOGGING);

  const getLogger = (timeout: number) => {
    const context = {
      getRemainingTimeInMillis: (): number => timeout,
    } as Context;
    return logger.fromContext(event, context, {stream, level});
  };

  describe('when taking the timeout from context', () => {
    it('should not log before the timeout expires', () => {
      getLogger(timeout);
      jest.advanceTimersByTime(timeNotToTriggerTimeout);

      expect(stream.read()).toBeNull();
    });

    it('should log once the timeout expires', () => {
      getLogger(timeout);
      jest.advanceTimersByTime(timeToTriggerTimeout);

      expect(stream.read()).toMatchObject(expected);
    });
  });

  describe('when explicitly providing the timeout', () => {
    it('should not log before the timeout expires', () => {
      getLogger(timeout);
      jest.advanceTimersByTime(timeNotToTriggerTimeout);

      expect(stream.read()).toBeNull();
    });

    it('should log once the timeout expires', () => {
      getLogger(timeout);
      jest.advanceTimersByTime(timeToTriggerTimeout);

      const actual = stream.read();
      expect(actual).toMatchObject(expected);
    });

    it('should not log if the timeout is ridiculously short', () => {
      getLogger(timeoutUnderLimit);
      jest.advanceTimersByTime(timeToTriggerForUnderLimitTimeout);

      expect(stream.read()).toBeNull();
    });

    it('should not trigger timeout twice when recreating the logger', () => {
      const logger = getLogger(timeToTriggerTimeout);
      jest.advanceTimersByTime(timeToTriggerTimeout);
      expect(stream.read()).toMatchObject(expected);

      // calling `withData` will recreate the logger - potentially triggering the lambda timout setup code
      logger.withData({some: 'data'});

      jest.advanceTimersByTime(timeToTriggerTimeout);
      expect(stream.read()).toBeNull();
    });
  });

  describe('when not providing the timeout and not providing a useful context', () => {
    it('should not blow up', () => {
      logger.fromContext(event, {} as Context, {});

      expect(stream.read()).toBeNull();
    });
  });
});
