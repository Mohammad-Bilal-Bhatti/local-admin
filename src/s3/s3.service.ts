import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { 
    Event,
    CORSRule,
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
    PutBucketWebsiteCommand,
    PutBucketWebsiteCommandOutput,
    PutBucketPolicyCommand,
    PutBucketPolicyCommandOutput,
    GetBucketPolicyCommand,
    GetBucketPolicyCommandOutput,
    GetBucketVersioningCommand,
    GetBucketVersioningCommandOutput,
    PutBucketVersioningCommand,
    PutBucketVersioningCommandOutput,
    ListObjectVersionsCommand,
    ListObjectVersionsCommandOutput,
    GetBucketCorsCommand,
    GetBucketCorsCommandOutput,
    PutBucketCorsCommand,
    PutBucketCorsCommandOutput,
    PutBucketNotificationConfigurationCommand,
    PutBucketNotificationConfigurationCommandOutput,
    GetBucketNotificationConfigurationCommand,
    GetBucketNotificationConfigurationCommandOutput,
    GetBucketReplicationCommand,
    GetBucketReplicationCommandOutput,
    PutBucketReplicationCommand,
    PutBucketReplicationCommandOutput,
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

    async putObject(
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
    
    async deleteObject(bucket: string, key: string, versionId?: string): Promise<DeleteObjectCommandOutput> {
        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
            VersionId: versionId
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

    async putBucketWebsite(bucket: string, root: string, error: string): Promise<PutBucketWebsiteCommandOutput> {
        const command = new PutBucketWebsiteCommand({ 
            Bucket: bucket, 
            WebsiteConfiguration: {
                IndexDocument: {
                    Suffix: root
                },
                ErrorDocument: {
                    Key: error
                }
            }
        });
        const response = await this.client.send(command);
        return response;
    }

    async putBucketPolicy(bucket: string, policy: string): Promise<PutBucketPolicyCommandOutput> {
        const command = new PutBucketPolicyCommand({
            Bucket: bucket,
            Policy: policy,
        });
        const response = await this.client.send(command);
        return response;
    }

    async getBucketPolicy(bucket: string): Promise<GetBucketPolicyCommandOutput> {
        try {
            const command = new GetBucketPolicyCommand({
                Bucket: bucket,            
            });    
            const response = await this.client.send(command);

            return response;
    
        } catch (err) {
            return { Policy: "{}", $metadata: {} };
        }
    }

    async getBucketVersioning(bucket: string): Promise<GetBucketVersioningCommandOutput> {
        try {
            const command = new GetBucketVersioningCommand({
                Bucket: bucket,
            });
            const response = await this.client.send(command);
            return response;
        } catch (err) {
            return { $metadata: {}, MFADelete: 'Disabled', Status: 'Suspended' };
        }
    }

    async putBucketVersioning(bucket: string, enableVersioning: boolean, enableMfaDelete: boolean): Promise<PutBucketVersioningCommandOutput> {
        const command = new PutBucketVersioningCommand({
            Bucket: bucket,
            VersioningConfiguration: {
                Status: enableVersioning ? 'Enabled' : 'Suspended',
                MFADelete: enableMfaDelete ? 'Enabled' : 'Disabled',
            },
        });
        const response = await this.client.send(command);
        return response;
    }

    async listObjectVersions(bucket: string, key: string): Promise<ListObjectVersionsCommandOutput> {
        const command = new ListObjectVersionsCommand({
            Bucket: bucket,
            Prefix: key,
        });
        const response = await this.client.send(command);
        return response;
    }

    async getBucketCors(bucket: string): Promise<GetBucketCorsCommandOutput> {
        try {
            const command = new GetBucketCorsCommand({
                Bucket: bucket,
            });
            const response = await this.client.send(command);
            return response;
        } catch (error) {
            const rules: CORSRule[] = [];
            return { $metadata: {}, CORSRules: rules };
        }
    }

    async putBucketCors(
        bucket: string,
        allowedHeaders: string | string[],
        allowedMethods: string | string[],
        allowedOrigins: string | string[],
        exposeHeaders: string | string[],
    ): Promise<PutBucketCorsCommandOutput> {
        const command = new PutBucketCorsCommand({
            Bucket: bucket,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: Array.isArray(allowedHeaders) ? allowedHeaders : [allowedHeaders],
                        AllowedMethods: Array.isArray(allowedMethods) ? allowedMethods : [allowedMethods],
                        AllowedOrigins: Array.isArray(allowedOrigins) ? allowedOrigins : [allowedOrigins],
                        ExposeHeaders: Array.isArray(exposeHeaders) ? exposeHeaders : [exposeHeaders],
                    }
                ]
            }
        });
        const response = await this.client.send(command);
        return response;
    }

    async putBucketNotification(bucket: string, target: 'sqs' | 'sns' | 'lambda', targetArn: string, event: Event | Event[]): Promise<PutBucketNotificationConfigurationCommandOutput> {


        const command = new PutBucketNotificationConfigurationCommand({
            Bucket: bucket,
            NotificationConfiguration: {
                EventBridgeConfiguration: {},
                QueueConfigurations: target === 'sqs' ? [
                    {
                        QueueArn: targetArn,
                        Events: Array.isArray(event) ? event: [event],                        
                    }
                ]: null,
                TopicConfigurations: target === 'sns' ? [
                    {
                        TopicArn: targetArn,
                        Events: Array.isArray(event) ? event: [event],
                    }
                ]: null,
                LambdaFunctionConfigurations: target === 'lambda' ? [
                    {
                        LambdaFunctionArn: targetArn,
                        Events: Array.isArray(event) ? event: [event],                        
                    }
                ]: null,
            }
        });
        const response = await this.client.send(command);
        return response;
    }


    async getBucketNotifications(bucket: string): Promise<GetBucketNotificationConfigurationCommandOutput> {
        try {

            const command = new GetBucketNotificationConfigurationCommand({
                Bucket: bucket,
            });
            const response = await this.client.send(command);
            return response;

        } catch (error) {
            return { $metadata: {}, EventBridgeConfiguration: null, LambdaFunctionConfigurations: null, QueueConfigurations: null, TopicConfigurations: null };
        }
    }

    async getBucketReplication(bucket: string): Promise<GetBucketReplicationCommandOutput> {
        try {

            const command = new GetBucketReplicationCommand({
                Bucket: bucket,
            });
            const response = await this.client.send(command);
            return response;

        } catch (error) {
            return { $metadata: null, ReplicationConfiguration: null };
        }

    } 

    async putBucketReplication(bucket: string, role: string, destinationBucket: string, deleteMarkerReplication: boolean, existingObjectReplication: boolean) {
        const command = new PutBucketReplicationCommand({
            Bucket: bucket,
            ReplicationConfiguration: {
                Role: role,
                Rules: [
                    {
                        Destination: { Bucket: destinationBucket },
                        Status: 'Enabled',
                        DeleteMarkerReplication: { Status: deleteMarkerReplication ? 'Enabled' : 'Disabled' },
                        ExistingObjectReplication: { Status: existingObjectReplication ? 'Enabled' : 'Disabled' },
                    }
                ],
            }
        });
        const response = await this.client.send(command);
        return response;
    }

}
