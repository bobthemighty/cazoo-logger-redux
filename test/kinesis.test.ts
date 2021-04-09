import * as logger from '../src';
import {once, sink} from './helper';
import {context, event} from './data/kinesis';

it('When logging in a Kinesis stream event context', async () => {
  const stream = sink();

  const log = logger.fromContext(event, context, {stream});
  log.info('Hello world');

  const result = await once(stream, 'data');

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
      kinesis: {
        source: 'arn:aws:kinesis:eu-west-1:account-id:stream/lambda-stream',
        id:
          'shardId-000000000000:00000000000000000000000000000000000000000000000000000000',
      },
    },
    msg: 'Hello world',
  });
});
