#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {InfraStack} from '../lib';

const app = new cdk.App();
const {
  env: {
    FIREHOSE_LOGICAL_ID,
    FIREHOSE_NAME,
    DESTINATION_BUCKET_LOGICAL_ID,
    DESTINATION_BUCKET_NAME,
    FIREHOSE_S3_ROLE_LOGICAL_ID,
    FIREHOSE_S3_ROLE_NAME,
    GATEWAY_FIREHOSE_ROLE_LOGICAL_ID,
    GATEWAY_FIREHOSE_ROLE_NAME,
    GATEWAY_LOGICAL_ID,
    REQUEST_VALIDATOR_NAME,
  },
} = process;

new InfraStack(app, 'InfraStack', {
  firehoseConstructProps: {
    firehoseLogicalId: FIREHOSE_LOGICAL_ID!,
    firehoseName: FIREHOSE_NAME!,
  },
  s3BucketConstructProps: {
    destinationBucketLogicalId: DESTINATION_BUCKET_LOGICAL_ID!,
    destinationBucketName: DESTINATION_BUCKET_NAME!,
  },
  iamConstructProps: {
    firehoseS3RoleLogicalId: FIREHOSE_S3_ROLE_LOGICAL_ID!,
    firehoseS3RoleName: FIREHOSE_S3_ROLE_NAME!,
    gatewayFirehoseRoleLogicalId: GATEWAY_FIREHOSE_ROLE_LOGICAL_ID!,
    gatewayFirehoseRoleName: GATEWAY_FIREHOSE_ROLE_NAME!,
  },
  gatewayConstructProps: {
    gatewayLogicalId: GATEWAY_LOGICAL_ID!,
    requestValidatorName: REQUEST_VALIDATOR_NAME!,
  },
});
