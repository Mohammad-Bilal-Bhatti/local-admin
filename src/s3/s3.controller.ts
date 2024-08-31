import { Body, Controller, Get, Post, Query, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { response, Response } from "express";
import { S3Service } from "./s3.service";
import { CreateBucketInput, UploadObjectInput } from "src/dtos/s3.input.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('s3')
export class S3Controller {

    constructor(private readonly s3Service: S3Service) {}

    @Get()
    async s3List(@Res() res: Response) {
      const result = await this.s3Service.listBuckets();
      const { Buckets, Owner } = result;
      return res.render('s3-list', { name: "S3", Buckets, Owner });
    }

    @Get('create')
    async getCreateBucket(@Res() res: Response) {
      return res.render('s3-create-bucket', {});
    }

    @Post('create')
    async createBucket(
      @Res() res: Response,
      @Body() input: CreateBucketInput,
    ) {
      const newBucket = await this.s3Service.createBucket(input.name);
      return res.redirect(302, '/s3');
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Body() input: UploadObjectInput,
      @Res() res: Response
    ) {

      const timestamp = Date.now();
      const bucket = input.bucket;
      const key = `${timestamp}-${file.originalname}`;
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
    async getBucketDetails(
      @Query('name') name: string,
      @Res() res: Response
    ) {

      const result = await this.s3Service.listObjects(name);
      return res.render('s3-bucket-detail', { name, Contents: result.Contents });
    }

    @Get('remove')
    async deleteBucket(
      @Query('bucket') bucket: string,
      @Res() res: Response
    ) {

      const result = await this.s3Service.deleteBucket(bucket);
      return res.redirect(302, '/s3');
    }

    @Get('object')
    async getObject(
      @Query('bucket') bucket: string,
      @Query('key') key: string,
      @Res() res: Response,
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

      return res.render('s3-object-detail', { bucket, key, attributes });

    }

    @Get('object/download')
    async downloadObject(
      @Query('bucket') bucket: string,
      @Query('key') key: string,
      @Res() res: Response,
    ) {

      const s3Object = await this.s3Service.getObject(bucket, key);

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

}
