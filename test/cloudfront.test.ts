import * as logger from '../src';
import {sink, once} from './helper';
import {requestEvent, context} from './data/cloudfront';

it('When logging in a cloudfront request context', async () => {
  const stream = sink();

  const log = logger.fromContext(requestEvent, context, {stream});
  log.info('Hello world');

  const result = await once(stream);

  expect(result).toStrictEqual({
    level: 'info',
    context: {
      request_id: context.awsRequestId,
      account_id: 'account-id',
      function: {
        name: context.functionName,
        version: context.functionVersion,
        service: 'Unknown',
      },
      cf: {
        path: '/picture.jpg',
        method: 'GET',
        dist: 'EDFDVBD6EXAMPLE',
        type: 'viewer-request',
        id: 'MRVMF7KydIvxMWfJIglgwHQwZsbG2IhRJ07sn9AkKUFSHS9EXAMPLE==',
      },
    },
    msg: 'Hello world',
  });
});
