import { Runtime } from "@aws-sdk/client-lambda";


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

export { Runtime } from "@aws-sdk/client-lambda";
