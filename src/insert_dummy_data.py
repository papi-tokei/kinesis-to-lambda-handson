from typing import TypedDict
import json
import random
from datetime import datetime
import boto3

# TODO: printをLoggerに変更する

KINESIS_CLIENT = boto3.client('kinesis')
SensorDataType = TypedDict(
    'SensorDataType', {'brightness': int, 'ID': str, 'time_sensor': str}
)


def handler(event, context) -> None:
    try:
        print('hello2')
        sensor_data: SensorDataType = {
            'brightness': random.randint(100, 200),
            'ID': 'id000',
            'time_sensor': datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
        }

        response = KINESIS_CLIENT.put_record(
            Data=json.dumps(sensor_data), PartitionKey='key1', StreamName='iotan-s-5'
        )
    except Exception as err:
        print(err)
