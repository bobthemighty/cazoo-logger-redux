import * as logger from '../src';
import {sink} from './helper';
import {event, context} from './data/sns';

it('When recording an outbound HTTP request', () => {
  const stream = sink();

  let log = logger.fromContext(event, context, {stream, level: 'debug'});
  log = log.withHttpRequest({
    url: 'http://google.com',
    method: 'get',
  });
  log.info({type: 'outbound-http'});
  const request = stream.read();

  log.withHttpResponse({status: 200}).info('Got stuff');
  const response = stream.read();

  expect(request.data).toMatchObject({
    http: {
      req: {
        url: 'http://google.com',
        method: 'get',
      },
    },
  });

  expect(response.data).toMatchObject({
    http: {
      resp: {
        status: 200,
      },
    },
  });

  expect(request.data.http.req.id).toBe(response.data.http.req.id);
});

describe('When recording a response alone', () => {
  const stream = sink();
  const log = logger.fromContext(event, context, {stream, level: 'debug'});
  let result: any;

  beforeAll(() => {
    log.withHttpResponse({status: 400}).info('Bad request');
    result = stream.read();
  });

  it('Should record the status', () => {
    expect(result.data.http.resp.status).toBe(400);
  });

  it('Should not record an id', () => {
    expect(result.data.http.req).toBeUndefined();
  });
});
