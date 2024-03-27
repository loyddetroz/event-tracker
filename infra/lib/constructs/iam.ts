import {Construct} from 'constructs';
import {
  Role,
  ServicePrincipal,
  PolicyDocument,
  Effect,
} from 'aws-cdk-lib/aws-iam';
import {IamConstructProps} from '../types';

export default class IamConstruct extends Construct {
  public readonly firehoseS3Role: Role;
  public readonly gatewayCredentialsRole: Role;

  constructor(scope: Construct, id: string, props: IamConstructProps) {
    super(scope, `${id}IamConstruct`);

    this.firehoseS3Role = this.buildFirehoseS3Role(props);
    this.gatewayCredentialsRole = this.buildGatewayCredentialsRole(props);
  }

  private buildFirehoseS3Role(props: IamConstructProps): Role {
    const {firehoseS3RoleLogicalId, firehoseS3RoleName, destinationBucket} =
      props;

    return new Role(this, firehoseS3RoleLogicalId, {
      roleName: firehoseS3RoleName,
      assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
      inlinePolicies: {
        kinesisS3Policy: PolicyDocument.fromJson({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: Effect.ALLOW,
              Action: [
                's3:AbortMultipartUpload',
                's3:GetBucketLocation',
                's3:GetObject',
                's3:ListBucket',
                's3:ListBucketMultipartUploads',
                's3:PutObject',
              ],
              Resource: `${destinationBucket.bucketArn}/*`,
            },
          ],
        }),
        kinesisLambdaPolicy: PolicyDocument.fromJson({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: 'lambda:*',
              Resource: '*',
            },
          ],
        }),
        firehosePolicy: PolicyDocument.fromJson({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: 'firehose:*',
              Resource: '*',
            },
          ],
        }),
      },
    });
  }

  private buildGatewayCredentialsRole(props: IamConstructProps) {
    const {gatewayFirehoseRoleLogicalId, gatewayFirehoseRoleName} = props;

    return new Role(this, gatewayFirehoseRoleLogicalId, {
      roleName: gatewayFirehoseRoleName,
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        firehosePolicy: PolicyDocument.fromJson({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: 'firehose:*',
              Resource: '*',
            },
          ],
        }),
      },
    });
  }
}
