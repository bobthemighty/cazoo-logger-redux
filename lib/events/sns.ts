import { SNSEvent } from "aws-lambda";

export function isSNS(event: unknown): event is SNSEvent {
  if (!event.Records) return false;
  if (!Array.isArray(event.Records)) return false;
  return event.Records.length > 0 && event.Records[0].EventSource === "aws:sns";
}
