import * as cdk from "@aws-cdk/core";
import { RemovalPolicy } from "@aws-cdk/core";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import { Function, Runtime, Code, StartingPosition } from "@aws-cdk/aws-lambda";
import { Stream } from "@aws-cdk/aws-kinesis";
import { KinesisEventSource } from "@aws-cdk/aws-lambda-event-sources";

export class KinesisToLambdaHandsonStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // テーブルにデータを書き込むLambdaを作成する
    const fn = new Function(this, "MyFunction", {
      functionName: "kinesis-to-lambda-handson",
      runtime: Runtime.PYTHON_3_8,
      handler: "index.handler",
      code: Code.fromAsset("src"),
    });

    // Kinesisにダミーデータを挿入するLambdaを作成する
    const fn2 = new Function(this, "MyFunction2", {
      functionName: "kinesis-to-lambda-insert-dummy-data",
      runtime: Runtime.PYTHON_3_8,
      handler: "insert_dummy_data.handler",
      code: Code.fromAsset("src"),
    });

    // テスト用のDynamoDBテーブルを作成する
    const table = new Table(this, "Table", {
      tableName: "iotan-funnel-5",
      partitionKey: { name: "ID", type: AttributeType.STRING },
      sortKey: { name: "time_sensor", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    // Lambda関数にテーブルの書き込み権限を付与する
    table.grantWriteData(fn);

    // Kinesis Streamを作成する
    const stream = new Stream(this, "MyFirstStream", {
      streamName: "iotan-s-5",
      shardCount: 1,
    });
    // Lambda関数にストリームの読み取り権限を付与する
    stream.grantRead(fn);
    // Lambda関数にストリームの読み取り権限を付与する
    stream.grantWrite(fn2);
    // Kinesis StreamでLambdaが起動するように設定する
    fn.addEventSource(
      new KinesisEventSource(stream, {
        batchSize: 100,
        startingPosition: StartingPosition.TRIM_HORIZON,
      })
    );
  }
}
