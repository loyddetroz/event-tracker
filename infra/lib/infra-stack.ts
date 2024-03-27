import {Construct} from 'constructs';
import {
  FirehoseConstruct,
  GatewayConstruct,
  IamConstruct,
  S3Construct,
} from './constructs';
import {InfraProps} from './types';
import {ControllerConstruct} from '../src';
import {Stack, StackProps} from 'aws-cdk-lib';

export default class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props: InfraProps & StackProps) {
    super(scope, id);

    const {
      s3BucketConstructProps,
      firehoseConstructProps,
      iamConstructProps,
      gatewayConstructProps,
    } = props;

    const {destinationBucket} = new S3Construct(
      this,
      id,
      s3BucketConstructProps
    );

    const {firehoseS3Role, gatewayCredentialsRole: credentialsRole} =
      new IamConstruct(this, id, {
        ...iamConstructProps,
        destinationBucket,
      });

    const {firehoseStream} = new FirehoseConstruct(this, id, {
      ...firehoseConstructProps,
      destinationBucket,
      firehoseS3Role,
    });

    const gatewayConstruct = new GatewayConstruct(this, id, {
      ...gatewayConstructProps,
      credentialsRole,
    });

    new ControllerConstruct(this, id, {
      firehoseStream,
      gatewayConstruct,
    });
  }
}
