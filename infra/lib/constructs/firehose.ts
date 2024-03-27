import {Construct} from 'constructs';
import {CfnDeliveryStream} from 'aws-cdk-lib/aws-kinesisfirehose';
import {FirehoseConstructProps} from '../types';

export default class FirehoseConstruct extends Construct {
  static DELIVERY_STREAM_TYPE = 'DirectPut';

  public readonly firehoseStream: CfnDeliveryStream;

  constructor(scope: Construct, id: string, props: FirehoseConstructProps) {
    super(scope, `${id}FirehoseConstruct`);

    this.firehoseStream = this.buildStream(props);
  }

  private buildStream(props: FirehoseConstructProps): CfnDeliveryStream {
    const {
      firehoseLogicalId,
      firehoseName,
      destinationBucket,
      firehoseS3Role: role,
    } = props;

    return new CfnDeliveryStream(this, firehoseLogicalId, {
      deliveryStreamName: firehoseName,
      deliveryStreamType: FirehoseConstruct.DELIVERY_STREAM_TYPE,
      extendedS3DestinationConfiguration: {
        bucketArn: destinationBucket.bucketArn,
        roleArn: role.roleArn,
        bufferingHints: {
          sizeInMBs: 64,
          intervalInSeconds: 60,
        },
        prefix: 'data/!{partitionKeyFromQuery:type}/!{timestamp:yyyy-MM-dd}/',
        errorOutputPrefix: 'errors/',
        dynamicPartitioningConfiguration: {
          enabled: true,
        },
        processingConfiguration: {
          enabled: true,
          processors: [
            {
              type: 'MetadataExtraction',
              parameters: [
                {
                  parameterName: 'MetadataExtractionQuery',
                  parameterValue: '{type:.type}',
                },
                {
                  parameterName: 'JsonParsingEngine',
                  parameterValue: 'JQ-1.6',
                },
              ],
            },
          ],
        },
      },
    });
  }
}
