import {APIGatewayProxyEvent, SNSEvent} from 'aws-lambda';

export type AnyEvent = SNSEvent | APIGatewayProxyEvent;
