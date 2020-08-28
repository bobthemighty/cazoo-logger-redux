import {
    Context,
    SNSEvent,
    SNSMessage,
    SNSEventRecord,
    S3Event
} from "aws-lambda";
import hasOwnProperty from "../hasOwnProperty"
import {makeContext} from "./context"
import { LoggerOptions } from "../core"

function isSNS(event: object): event is SNSEvent {
    if (!hasOwnProperty(event, "Records")) return false;
    if (!event.Records) return false;
    if (!Array.isArray(event.Records)) return false;
    return event.Records.length > 0 && event.Records[0].EventSource === "aws:sns";
}

function isS3(msg: object): msg is S3Event {
    if (!hasOwnProperty(msg, "Records")) return false;
    if (!Array.isArray(msg.Records)) return false;
    return msg.Records.length > 0 && hasOwnProperty(msg.Records[0], "s3");
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

