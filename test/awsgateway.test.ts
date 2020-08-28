import * as logger from '../lib'
import { sink } from './helper'
import { event, websocketEvent, context } from './data/awsgateway'

it('When logging in an API Gateway event context', () => {
  const stream = sink()

  const log = logger.fromContext(event, context, { stream })
  log.info('Hello world')

  const result = stream.read()

  expect(result).toStrictEqual({
    level: 'info',
    context: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      request_id: context.awsRequestId,
      // eslint-disable-next-line @typescript-eslint/camelcase
      account_id: event.requestContext.accountId,
      function: {
        name: context.functionName,
        version: context.functionVersion,
        service: 'Unknown',
      },
      http: {
        path: event.path,
        method: event.httpMethod,
        stage: event.requestContext.stage,
        query: {
          name: ['me'],
          multivalueName: ['you', 'me'],
        },
      },
    },
    msg: 'Hello world',
  })
})

it('When logging a websocket request', () => {
  const stream = sink()

  const log = logger.fromContext(websocketEvent, context, { stream })
  log.info('Hello world')

  const result = stream.read()

  expect(result).toMatchObject({
    level: 'info',
    context: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      request_id: context.awsRequestId,
      // eslint-disable-next-line @typescript-eslint/camelcase
      account_id: event.requestContext.accountId,
      function: {
        name: context.functionName,
        version: context.functionVersion,
        service: 'Unknown',
      },
      http: {
        stage: websocketEvent.requestContext.stage,
        connectionId: 'Bui-jdesjoECJWg=',
        routeKey: '$connect',
      },
    },
    msg: 'Hello world',
  })
})
