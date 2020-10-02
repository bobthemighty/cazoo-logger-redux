import * as logger from '../src';
import {sink, once} from './helper';
import {record, context} from './data/sqs';

it('When logging in an SQS event context', async () => {
  const stream = sink();

  const log = logger.fromContext(record, context, {stream});
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
      sqs: {
        source: record.eventSourceARN,
        id: record.messageId,
      },
    },
    msg: 'Hello world',
  });
});
