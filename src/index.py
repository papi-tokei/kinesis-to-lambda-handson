"""
Kinesis Data Streamからデータを取得し、DynamoDB テーブルにデータを格納する
"""
import logging
import base64
import json
from datetime import datetime
import traceback
import boto3

LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.DEBUG)
DYNAMODB = boto3.resource('dynamodb')


def handler(event, _):
    """
    Lambdaのハンドラー関数
    """
    try:
        table = DYNAMODB.Table('iotan-funnel-5')
        for kinesis_data in event['Records']:
            LOGGER.debug('raw kinesis data ===================')
            LOGGER.debug(kinesis_data['kinesis'])

            # base64エンコードされたデータをデコードする
            b6decoded_kinesis_Data = base64.b64decode(kinesis_data["kinesis"]["data"])

            LOGGER.debug('base64 decode kinesis data =========')
            LOGGER.debug(b6decoded_kinesis_Data)

            # byte型からstr型に変換
            processed_kinesis_Data = json.loads(b6decoded_kinesis_Data.decode('utf-8'))

            LOGGER.debug('processed kinesis data =========')
            LOGGER.debug(processed_kinesis_Data)

            # テーブルにデータを書き込む
            table.put_item(
                Item={
                    # デバイスIDのkey名に合わせて変更する
                    'ID': processed_kinesis_Data['ID'],
                    # タイムスタンプのkey名に合わせて変更する
                    'time_sensor': processed_kinesis_Data['time_sensor'],
                    # センサー計測値のkey名に合わせて変更する
                    'brightness': processed_kinesis_Data['brightness'],
                    # Lambdaの処理時刻をUTCで記録する
                    'time_lambda': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                }
            )
    except Exception as err:
        LOGGER.error(err)
        LOGGER.error(traceback.format_exc())
