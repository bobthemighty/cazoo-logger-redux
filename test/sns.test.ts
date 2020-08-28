/* eslint-disable @typescript-eslint/camelcase */
import * as logger from "../lib";
import { sink, once } from "./helper";
import { event, nonS3Event, context } from "./data/sns";

it("When logging in an S3 SNS context", async () => {
  const stream = sink();

  const log = logger.fromContext(event, context, { stream });
  log.info("Hello world");

  const result = await once(stream, "data");

  expect(result).toStrictEqual({
    level: "info",
    context: {
      request_id: context.awsRequestId,
      account_id: "account-id",
      function: {
        name: context.functionName,
        version: context.functionVersion,
        service: "Unknown"
      },
      event: {
        id: "916959af-5266-559e-befa-0c1576863e9a",
        source:
          "arn:aws:sns:eu-west-1:account-id:verified-features-s3-bucket-topic"
      },
      s3: {
        bucket: "verified-features-raw-us-west-1-account-id",
        key: "raw/example.csv"
      }
    },
    msg: "Hello world"
  });
});

it("When logging in a non S3 SNS context", async () => {
  const stream = sink();

  const log = logger.fromContext(nonS3Event, context, { stream });
  log.info("Hello world");

  const result = await once(stream, "data");

  expect(result).toStrictEqual({
    level: "info",
    context: {
      request_id: context.awsRequestId,
      account_id: "account-id",
      function: {
        name: context.functionName,
        version: context.functionVersion,
        service: "Unknown"
      },
      event: {
        id: "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        source: "arn:aws:sns:us-east-2:123456789012:sns-lambda"
      }
    },
    msg: "Hello world"
  });
});
