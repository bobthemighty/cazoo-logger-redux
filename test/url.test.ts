import * as logger from '../src';
import {sink, once} from './helper';
import {event, context} from './data/dynamodb';
import { URL } from "url";


it('When logging a url', async () => {
  const stream = sink();
  const now = new Date();

  const log = logger.empty({
      stream
  });
  log.withData({
      uri: new URL("https://www.google.com")
  }).withData({
      now
  }).info('Hello world');

  const result = await once(stream);

  expect(result).toStrictEqual({
    level: 'info',
    msg: 'Hello world',
    data: {
        uri: 'https://www.google.com',
        now: now.toISOString()
    }
  });
});
