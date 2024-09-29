

export class CreateShardDto {
    streamName: string;
    shardCount: number;
}


export class PutRecordDto {
    streamName: string;
    partitionKey: string;
    data: string;
}
