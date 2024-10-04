import { Body, Controller, Get, Post, Query, Redirect, Render, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { S3Service } from "./s3.service";
import { CreateBucketInput, CreateWebsiteDto, PutBucketPolicyDto, UploadObjectInput } from "./s3.input.dto";
import { FileInterceptor } from "@nestjs/platform-express";

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
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Body() input: UploadObjectInput,
      @Res() res: Response
    ) {

      const bucket = input.bucket;
      const key = input.key ?? file.originalname;
      const contentLength = file.size;
      const contentType = file.mimetype;
      const body = file.buffer;

      const response = await this.s3Service.uploadObject(
        bucket,
        key,
        body,
        contentType,
        contentLength
      );
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

      return { bucket, key, attributes };
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
      @Res() res: Response,
    ) {

      const result = await this.s3Service.deleteObject(bucket, key);
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
      const policy = await this.s3Service.getBucketPolicy(bucket);
      return { bucket, Policy: policy };
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

}
