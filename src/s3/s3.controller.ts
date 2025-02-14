import { Body, Controller, Get, Post, Query, Redirect, Render, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { S3Service } from "./s3.service";
import { CreateBucketInput, CreateBucketNoficationDto, CreateWebsiteDto, PutBucketCorsPolicyDto, PutBucketPolicyDto, PutBucketVersioningDto, UploadObjectInput, Event as S3Events, CreateBucketReplicationDto } from "./s3.input.dto";
import {  FilesInterceptor } from "@nestjs/platform-express";

@Controller('s3')
export class S3Controller {

    constructor(private readonly s3Service: S3Service) {}

    @Get()
    @Render('s3-list')
    async s3List() {
      const result = await this.s3Service.listBuckets();
      const { Buckets, Owner } = result;
      return { name: "S3", Buckets, Owner };
    }

    @Get('create')
    @Render('s3-create-bucket')
    async getCreateBucket() {
      return {};
    }

    @Post('create')
    @Redirect('/s3', 302)
    async createBucket(
      @Body() input: CreateBucketInput,
    ) {
      const newBucket = await this.s3Service.createBucket(input.name);
      return { query: 'value' };
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFile(
      @UploadedFiles() files: Express.Multer.File[],
      @Body() input: UploadObjectInput,
      @Res() res: Response
    ) {

      const isMultiple = files.length > 1;
      const bucket = input.bucket;
      for (const file of files) {
        const key = isMultiple ? file.originalname : input.key ? input.key : file.originalname;
        await this.s3Service.uploadStream(bucket, key, file);
      }

      return res.redirect(302, `/s3/details?name=${bucket}`);
    }

    @Get('details')
    @Render('s3-bucket-detail')
    async getBucketDetails(
      @Query('name') name: string,
      @Query('search') search: string,
    ) {

      const result = await this.s3Service.listObjects(name, search);
      return { name, Contents: result.Contents };
    }

    @Get('purge-bucket')
    async purgeBucket(
      @Res() res: Response,
      @Query('bucket') bucket: string
    ) {
      const result = await this.s3Service.listObjects(bucket, null);
      for (const object of result.Contents) {
        await this.s3Service.deleteObject(bucket, object.Key);
      }
      res.redirect(302, `/s3/details?name=${bucket}`);
    }

    @Get('remove')
    @Redirect('/s3', 302)
    async deleteBucket(@Query('bucket') bucket: string) {
      const result = await this.s3Service.deleteBucket(bucket);
      return null;
    }

    @Get('object')
    @Render('s3-object-detail')
    async getObject(
      @Query('bucket') bucket: string,
      @Query('key') key: string,
    ) {

      const response = await this.s3Service.getObject(bucket, key);
      const { Versions } = await this.s3Service.listObjectVersions(bucket, key);

      const { 
        AcceptRanges,
        ContentType, 
        ContentLength, 
        LastModified,
        ETag,
        ServerSideEncryption,
        Metadata,
      } = response;

      const attributes = {
        ContentType,
        ContentLength,
        AcceptRanges,
        ETag,
        LastModified,
        ServerSideEncryption,
        Metadata,
      };

      return { bucket, key, attributes, Versions };
    }

    @Get('object/download')
    async downloadObject(
      @Query('bucket') bucket: string,
      @Query('key') key: string,
      @Res() res: Response,
    ) {

      const s3Object = await this.s3Service.getObject(bucket, key);

      /* set response headers */
      res.setHeader('Content-Type', s3Object.ContentType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${key}"`);

      const stream = s3Object.Body.transformToWebStream();
      const reader = stream.getReader();

      let done: boolean;
      do {

        const result = await reader.read();
        if (result.value) res.write(result.value);
        done = result.done;
  
      } while (!done);

      res.end();
    }

    @Get('object/delete')
    async deleteObject(
      @Query('bucket') bucket: string,
      @Query('key') key: string,
      @Query('versionId') versionId: string,
      @Res() res: Response,
    ) {

      const result = await this.s3Service.deleteObject(bucket, key, versionId);
      return res.redirect(302, `/s3/details?name=${bucket}`);
    }

    @Get('presigned-get')
    @Render('s3-presigned')
    async getPresignedGet(
      @Query('bucket') bucket: string,
      @Query('key') key: string,
    ) {

      const url = await this.s3Service.getPresignedGet(bucket, key);
      return { bucket, key, url };
    }

    @Get('presigned-put')
    @Render('s3-presigned')
    async getPresignedPut(
      @Query('bucket') bucket: string,
      @Query('key') key: string,
    ) {
      const url = await this.s3Service.getPresignedPut(bucket, key);
      return { bucket, key, url };
    }

    @Get('bucket-policy')
    @Render('s3-bucket-policy')
    async getBucketPolicy(@Query('bucket') bucket: string) {
      const { Policy } = await this.s3Service.getBucketPolicy(bucket);
      return { bucket, Policy: Policy };
    }

    @Post('bucket-policy')
    async putBucketPolicy(@Res() res: Response, @Body() input: PutBucketPolicyDto) {
      const result = await this.s3Service.putBucketPolicy(input.bucket, input.policy);
      return res.redirect(302, `/s3/details?name=${input.bucket}`);
    }

    @Get('create-website')
    @Render('s3-create-website')
    async getCreateWebsite(@Query('bucket') bucket: string) {
      return { bucket };
    }

    @Post('create-website')
    async createWebsite(@Res() res: Response, @Body() input: CreateWebsiteDto) {
      const result = await this.s3Service.putBucketWebsite(input.bucket, input.index, input.error);
      return res.redirect(302, `/s3/details?name=${input.bucket}`);
    }

    @Get('bucket-versioning')
    @Render('s3-bucket-versioning')
    async getBucketVersioning(@Query('bucket') bucket: string) {
      const { Status, MFADelete } = await this.s3Service.getBucketVersioning(bucket);

      const versioningEnabled = Status === 'Enabled'; 
      const mfaDeleteEnabled = MFADelete === 'Enabled';

      return { bucket, versioningEnabled, mfaDeleteEnabled }
    }

    @Post('bucket-versioning')
    async putBucketVersioning(@Res() res: Response, @Body() input: PutBucketVersioningDto) {
      const result = await this.s3Service.putBucketVersioning(input.bucket, input.enableVersioning === 'true', input.enableMfaDelete === 'true');
      return res.redirect(302, `/s3/details?name=${input.bucket}`);
    }

    @Get('bucket-cors')
    @Render('s3-bucket-cors')
    async getBucketCors(@Query('bucket') bucket: string, @Query('tab') tab = 'rules') {
      const { CORSRules } = await this.s3Service.getBucketCors(bucket);
      return { bucket, CORSRules, tab };
    }

    @Post('bucket-cors')
    async updateBucketCors(@Res() res: Response, @Body() input: PutBucketCorsPolicyDto) {
      const result = await this.s3Service.putBucketCors(input.bucket, input.AllowedHeaders, input.AllowedMethods, input.AllowedOrigins, input.ExposeHeaders);
      return res.redirect(302, `/s3/details?name=${input.bucket}`);
    }

    @Get('bucket-notifications')
    @Render('s3-bucket-notifications')
    async getBucketNotifications(@Query('bucket') bucket: string, @Query('tab') tab = 'details') {
      const { $metadata, ...notifications } = await this.s3Service.getBucketNotifications(bucket);
      const s3EventOptions = Object.keys(S3Events).map(key => ({ label: key, value: S3Events[key] }));
      return { tab, bucket, notifications, s3EventOptions };
    }

    @Post('bucket-notifications')
    async createBucketNotification(@Res() res: Response, @Body() input: CreateBucketNoficationDto) {
      const result = await this.s3Service.putBucketNotification(input.bucket, input.target, input.targetArn, input.events);
      return res.redirect(302, `/s3/bucket-notifications?bucket=${input.bucket}`);
    }

    @Get('bucket-replication')
    @Render('s3-bucket-replication')
    async getBucketReplication(@Query('bucket') bucket: string, @Query('tab') tab = 'details') {
      const { ReplicationConfiguration } = await this.s3Service.getBucketReplication(bucket);
      return { tab, bucket, ReplicationConfiguration };
    }

    @Post('bucket-replication')
    async putBucketReplication(@Res() res: Response, @Body() input: CreateBucketReplicationDto) {
      const result = await this.s3Service.putBucketReplication(input.bucket, input.role, input.destinationBucket, input.deleteMarkerReplication === 'true', input.existingObjectReplication === 'true');
      return res.redirect(302, `/s3/bucket-replication?bucket=${input.bucket}`);
    }

}
