import {
  Context,
  SNSEvent,
  SNSMessage,
  SNSEventRecord,
  S3Event
} from "aws-lambda";
import { LoggerOptions } from "./core";

function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export function isSNS(event: object): event is SNSEvent {
  if (!hasOwnProperty(event, "Records")) return false;
  if (!event.Records) return false;
  if (!Array.isArray(event.Records)) return false;
  return event.Records.length > 0 && event.Records[0].EventSource === "aws:sns";
}

export function isS3(msg: object): msg is S3Event {
  if (!hasOwnProperty(msg, "Records")) return false;
  if (!Array.isArray(msg.Records)) return false;
  return msg.Records.length > 0 && hasOwnProperty(msg.Records[0], "s3");
}

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

function s3Data(sns: SNSMessage) {
  if (sns.Subject !== "Amazon S3 Notification") return;
  const msg = JSON.parse(sns.Message);

  if (isS3(msg)) {
    const record = msg.Records[0];
    return {
      bucket: record.s3.bucket.name,
      key: record.s3.object.key
    };
  }
}

export function forSns(
  event: object,
  context: Context,
  options: Partial<LoggerOptions>
) {
  if (!isSNS(event)) return;

  const sns = event.Records[0].Sns;

  return makeContext(context, options, {
    event: {
      id: sns.MessageId,
      source: sns.TopicArn
    },
    s3: s3Data(sns)
  });
}
