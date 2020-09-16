import {v4 as uuid} from 'uuid';
import {Logger, Context, child} from './core';

export interface HttpResponseRecord {
  status?: number;
  error?: Error;
  body?: any;
  elapsedMs?: number;
}

export interface HttpRequestRecord {
  url?: string;
  method?: string;
  body?: any;
}

interface HttpRequestContext extends HttpRequestRecord {
  id: string;
}

interface WithHttpRequest {
  data: {
    http: {req: HttpRequestContext};
  };
}

export interface HttpRecorder {
  withHttpRequest: (req: HttpRequestRecord) => this;
  withHttpResponse: (res: HttpResponseRecord) => this;
}

function hasRequest(ctx: Context): ctx is Context & WithHttpRequest {
  if (!('data' in ctx)) return false;
  if (typeof ctx.data !== 'object') return false;
  if (null === ctx.data) return false;
  if (!('http' in ctx.data)) return false;
  return true;
}

function _withHttpRequest<TContext extends Context>(
  this: Logger<TContext & WithHttpRequest>,
  req: HttpRequestRecord
): Logger<TContext & WithHttpRequest> {
  const id = uuid();
  return child(this, {
    data: {
      http: {
        req: {...req, id},
      },
    },
  });
}

function _withHttpResponse<
  TLogger extends Logger<(Context & WithHttpRequest) | Context>
>(this: TLogger, resp: HttpResponseRecord): TLogger {
  let reqId: string | undefined;
  if (hasRequest(this.context)) {
    reqId = this.context.data.http.req.id;
  }

  return child(this, {
    data: {
      http: {
        req: reqId ? {id: reqId} : undefined,
        resp,
      },
    },
  });
}

export function useHttpRecorder<TLogger>(
  target: TLogger
): TLogger & HttpRecorder {
  return Object.defineProperties(target, {
    withHttpRequest: {
      value: _withHttpRequest,
      enumerable: true,
    },
    withHttpResponse: {
      value: _withHttpResponse,
      enumerable: true,
    },
  });
}
