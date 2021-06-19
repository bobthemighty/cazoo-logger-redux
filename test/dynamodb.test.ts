import * as logger from '../src';
import {sink, once} from './helper';
import {event, context} from './data/dynamodb';

it('When logging in a DynamoDB stream event context', async () => {
  const stream = sink();

  const log = logger.fromContext(event, context, {stream});
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
      event: {
        id: 'given-event-id',
        source:
          'arn:aws:dynamodb:eu-west-1:account-id:table/TableName/stream/2020-01-01T00:00:00.000',
        type: 'REMOVE',
      },
    },
    msg: 'Hello world',
  });
});
