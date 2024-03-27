import {Construct} from 'constructs';
import {S3BucketConstructProps} from '../types';
import {Bucket} from 'aws-cdk-lib/aws-s3';

export default class S3Construct extends Construct {
  public readonly destinationBucket: Bucket;

  constructor(scope: Construct, id: string, props: S3BucketConstructProps) {
    super(scope, `${id}S3Construct`);

    this.destinationBucket = this.buildDestinationBucket(props);
  }

  private buildDestinationBucket(props: S3BucketConstructProps) {
    const {destinationBucketLogicalId, destinationBucketName} = props;

    return new Bucket(this, destinationBucketLogicalId, {
      bucketName: destinationBucketName,
    });
  }
}
