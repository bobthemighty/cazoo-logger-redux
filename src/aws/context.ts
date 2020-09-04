import {Context} from 'aws-lambda';
import {LoggerOptions} from '../core';

function parseAccountId(arn: string): string {
  if (!arn) {
    return 'missing';
  }
  const parts = arn.split(':');
  if (parts.length >= 5) {
    return parts[4];
  }
  return `unknown (${arn})`;
}

export interface ContextInfo extends Record<string, unknown> {
  request_id: string;
  account_id: string;
  function: {
    name: string;
    version: string;
    service?: string;
  };
}

export interface LambdaContext<T extends ContextInfo = ContextInfo>
  extends Record<string, unknown> {
  context: T;
}

export function makeContext<
  TContext extends ContextInfo = ContextInfo,
  TExtra extends Record<string, unknown> = Record<string, unknown>
>(
  ctx: Context,
  options: Partial<LoggerOptions>,
  extra: TExtra
): LambdaContext<ContextInfo & TExtra> {
  return {
    context: {
      request_id: ctx.awsRequestId,
      account_id: parseAccountId(ctx.invokedFunctionArn),
      function: {
        name: ctx.functionName,
        version: ctx.functionVersion,
        service:
          options.service || process.env.CAZOO_LOGGER_SERVICE || 'Unknown',
      },
      ...extra,
    },
  };
}
