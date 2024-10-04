import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { 
    ListBucketsCommand, 
    S3Client,
    ListObjectsV2Command,
    ListObjectsV2CommandOutput,
    GetObjectCommand,
    GetObjectCommandOutput,
    CreateBucketCommand,
    CreateBucketCommandOutput,
    PutObjectCommand,
    PutObjectCommandOutput,
    DeleteObjectCommand,
    DeleteObjectCommandOutput,
    DeleteBucketCommand,
    DeleteBucketCommandOutput,
    ListBucketsCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigureInput } from "../app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";


@Injectable()
export class S3Service implements ConfigurableService {

    private client: S3Client;

    constructor(private readonly configService: ConfigService) {
        this.client = new S3Client({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
            forcePathStyle: true,
        });
    }

    configure(configuration: ConfigureInput) {
        this.client = new S3Client({
            endpoint: configuration.endpoint,
            region: configuration.region,
            forcePathStyle: true,
        });
    }

    async listBuckets(): Promise<ListBucketsCommandOutput> {
        const command = new ListBucketsCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async listObjects(bucket: string, prefix: string): Promise<ListObjectsV2CommandOutput> {
        const command = new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
        });

        const result = await this.client.send(command);
        return result;
    }

    async getObject(bucket: string, key: string): Promise<GetObjectCommandOutput> {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });
        const reponse = await this.client.send(command);            
        return reponse;
    }

    async createBucket(name: string): Promise<CreateBucketCommandOutput> {
        const command = new CreateBucketCommand({
            Bucket: name,
        });

        const response = await this.client.send(command);
        return response;
    }

    async uploadObject(
        bucket: string, 
        key: string,
        body: string | Buffer,
        contentType: string,
        contentLength: number,
    ): Promise<PutObjectCommandOutput> {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
            ContentLength: contentLength,
        });

        const response = await this.client.send(command);
        return response;
    }
    
    async deleteObject(bucket: string, key: string): Promise<DeleteObjectCommandOutput> {
        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const response = await this.client.send(command);
        return response;
    }

    async deleteBucket(bucket: string): Promise<DeleteBucketCommandOutput> {
        const command = new DeleteBucketCommand({
            Bucket: bucket,
        });

        const response = await this.client.send(command);
        return response;
    }

    async getPresignedGet(bucket: string, key: string, expiresIn = 3600): Promise<string> {
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        const url = await getSignedUrl(this.client, command, { expiresIn: expiresIn });
        return url;
    }

    async getPresignedPut(bucket: string, key: string, expiresIn = 3600) {
        const command = new PutObjectCommand({ Bucket: bucket, Key: key });
        const url = await getSignedUrl(this.client, command, { expiresIn: expiresIn });
        return url;
    }

}
