import { Runtime, FunctionUrlAuthType, InvokeMode, EventSourcePosition } from "@aws-sdk/client-lambda";


export class CreateLambdaDto {
    name: string;
    description: string;
    role: string;
    s3Bucket: string;
    s3Key: string;
    runtime: Runtime;
    handler: string;
}

export class InvokeLambdaDto {
    name: string;
    payload: string;
}

export class CreateAliasDto {
    name: string;
    functionName: string;
    functionVersion: string;
}

export class UpdateFunctionCodeDto {
    functionName: string;
    s3Bucket: string;
    s3Key: string;
}

export class CreateFunctionUrlDto {
    functionName: string;
    authType: FunctionUrlAuthType;
    invokeMode: InvokeMode;
}

export class CreateEventSourceDto {
    functionName: string;
    batchSize: number
    startingPosition: EventSourcePosition;
    eventSourceArn: string
}

export { Runtime, FunctionUrlAuthType, InvokeMode, EventSourcePosition } from "@aws-sdk/client-lambda";

