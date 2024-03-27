import {Bucket} from 'aws-cdk-lib/aws-s3';
import {Role} from 'aws-cdk-lib/aws-iam';
import {JsonSchema, MethodResponse} from 'aws-cdk-lib/aws-apigateway';
import {CfnDeliveryStream} from 'aws-cdk-lib/aws-kinesisfirehose';
import {GatewayConstruct} from './constructs';

type FirehoseBaseProps = {
  firehoseLogicalId: string;
  firehoseName: string;
};

type FirehoseConstructProps = FirehoseBaseProps & {
  destinationBucket: Bucket;
  firehoseS3Role: Role;
};

type GatewayBaseProps = {
  gatewayLogicalId: string;
  requestValidatorName: string;
};

type GatewayConstructProps = GatewayBaseProps & {
  credentialsRole: Role;
};

type RouteOptions = {
  httpMethod: string;
  resourceName: string;
  requestTemplate: string;
  model: {
    modelName: string;
    contentType: string;
    schema: JsonSchema;
  };
  methodResponses: MethodResponse[];
};

type IamBaseProps = {
  firehoseS3RoleLogicalId: string;
  firehoseS3RoleName: string;
  gatewayFirehoseRoleLogicalId: string;
  gatewayFirehoseRoleName: string;
};

type IamConstructProps = IamBaseProps & {
  destinationBucket: Bucket;
};

type S3BucketConstructProps = {
  destinationBucketLogicalId: string;
  destinationBucketName: string;
};

type ControllerConstructProps = {
  firehoseStream: CfnDeliveryStream;
  gatewayConstruct: GatewayConstruct;
};

type InfraProps = {
  firehoseConstructProps: FirehoseBaseProps;
  s3BucketConstructProps: S3BucketConstructProps;
  iamConstructProps: IamBaseProps;
  gatewayConstructProps: GatewayBaseProps;
};

export {
  FirehoseConstructProps,
  GatewayConstructProps,
  RouteOptions,
  IamConstructProps,
  S3BucketConstructProps,
  ControllerConstructProps,
  InfraProps,
};
