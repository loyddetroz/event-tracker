import {Construct} from 'constructs';
import {
  RestApi,
  RequestValidator,
  AwsIntegration,
} from 'aws-cdk-lib/aws-apigateway';
import {GatewayConstructProps, RouteOptions} from '../types';

export default class GatewayConstruct extends Construct {
  private props: GatewayConstructProps;

  public readonly restApi: RestApi;
  public readonly requestValidator: RequestValidator;

  constructor(scope: Construct, id: string, props: GatewayConstructProps) {
    super(scope, `${id}GatewayConstruct`);

    this.props = props;
    this.restApi = this.buildRestApi(props);
    this.requestValidator = this.buildRequestValidator(id, this.restApi, props);
  }

  private buildRestApi(props: GatewayConstructProps): RestApi {
    const {gatewayLogicalId} = props;
    return new RestApi(this, gatewayLogicalId);
  }

  private buildRequestValidator(
    id: string,
    restApi: RestApi,
    props: GatewayConstructProps
  ): RequestValidator {
    const {requestValidatorName} = props;

    return new RequestValidator(this, `${id}RequestValidator`, {
      restApi,
      requestValidatorName,
      validateRequestBody: true,
    });
  }

  public addRoute(options: RouteOptions): void {
    const {credentialsRole} = this.props;
    const {model, requestTemplate, methodResponses, resourceName, httpMethod} =
      options;
    const {modelName} = model;

    const requestModel = this.restApi.addModel(modelName, model);

    const target = new AwsIntegration({
      service: 'firehose',
      action: 'PutRecord',
      options: {
        credentialsRole,
        requestTemplates: {
          'application/json': requestTemplate,
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': '{}',
            },
          },
        ],
      },
    });

    const methodOptions = {
      methodResponses,
      requestModels: {
        'application/json': requestModel,
      },
      requestValidator: this.requestValidator,
    };

    const resource = this.restApi.root.getResource(resourceName);
    if (!resource) {
      this.restApi.root
        .addResource(resourceName)
        .addMethod(httpMethod, target, methodOptions);
    } else {
      resource.addMethod(httpMethod, target, methodOptions);
    }
  }
}
