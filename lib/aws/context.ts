import {
  Context,
  SNSEvent,
  SNSMessage,
  SNSEventRecord,
  S3Event
} from "aws-lambda";
import { LoggerOptions } from "../core";

function parseAccountId(arn: string): string {
  if (!arn) {
    return "missing";
  }
  const parts = arn.split(":");
  if (parts.length >= 5) {
    return parts[4];
  }
  return `unknown (${arn})`;
}

export interface LoggerContext {
  request_id: string;
  account_id: string;
  function: {
    name: string;
    version: string;
    service?: string;
  };
  [property: string]: any;
}

export function makeContext(
  ctx: Context,
  options: Partial<LoggerOptions>,
  extra: any
): LoggerContext {
  return {
    // eslint-disable-next-line @typescript-eslint/camelcase
    request_id: ctx.awsRequestId,
    // eslint-disable-next-line @typescript-eslint/camelcase
    account_id: parseAccountId(ctx.invokedFunctionArn),
    function: {
      name: ctx.functionName,
      version: ctx.functionVersion,
      service: options.service || process.env.CAZOO_LOGGER_SERVICE || "Unknown"
    },
    ...extra
  };
}
