#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { KinesisToLambdaHandsonStack } from "../lib/kinesis-to-lambda-handson-stack";

const app = new cdk.App();
new KinesisToLambdaHandsonStack(app, "KinesisToLambdaHandsonStack");
