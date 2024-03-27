import {Construct} from 'constructs';
import {ControllerConstructProps} from '../../../lib/types';
import {
  Model,
  JsonSchemaType,
  JsonSchemaVersion,
} from 'aws-cdk-lib/aws-apigateway';

export default class ControllerConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ControllerConstructProps) {
    super(scope, `${id}ControllerConstruct`);
    const {gatewayConstruct} = props;

    const model = {
      modelName: 'EventModel',
      contentType: 'application/json',
      schema: {
        schema: JsonSchemaVersion.DRAFT4,
        title: 'event',
        type: JsonSchemaType.OBJECT,
        required: ['type', 'payload'],
        properties: {
          type: {
            type: JsonSchemaType.STRING,
          },
          payload: {
            type: JsonSchemaType.OBJECT,
          },
        },
      },
    };

    const methodResponses = [
      {
        statusCode: '200',
        responseModels: {
          'application/json': Model.EMPTY_MODEL,
        },
      },
    ];

    gatewayConstruct.addRoute({
      httpMethod: 'POST',
      resourceName: 'events',
      requestTemplate: this.buildRequestTemplate(props),
      model,
      methodResponses,
    });
  }

  private buildRequestTemplate(props: ControllerConstructProps) {
    const {firehoseStream} = props;
    const {deliveryStreamName} = firehoseStream;

    return `
    #set($data = "{""type"": $input.json('$.type'), ""payload"": $input.json('$.payload')}\n")
    {
      "DeliveryStreamName": "${deliveryStreamName!}",
      "Record": {
        "Data": "$util.base64Encode($data)"
      }
    }`;
  }
}
