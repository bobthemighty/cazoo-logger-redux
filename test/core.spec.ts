import * as logger from '../src';
import {once, sink} from './helper';

it('acceptance', () => {
  logger.empty().withData({foo: 'bar'}).info('hello world');
});

it('When including data', async () => {
  const stream = sink();

  const log = logger.empty({stream, level: 'debug'});
  log.withData({a: 1, b: 2}).debug('a thing happened');

  const request = await once(stream);
  expect(request).toMatchObject({
    level: 'debug',
    msg: 'a thing happened',
    data: {
      a: 1,
      b: 2,
    },
  });
});

it('When options are set in the environment', async () => {
  const stream = sink();

  process.env.CAZOO_LOGGER_LEVEL = 'debug';

  const log = logger.empty({stream});
  log.debug('random fandom');
  const request = await once(stream);

  expect(request).toMatchObject({
    level: 'debug',
    msg: 'random fandom',
  });
});
