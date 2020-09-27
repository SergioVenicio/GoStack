import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime-types';

import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';
import AppError from '@shared/errors/AppError';

export default class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }
  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmp_directory, file);
    const ContentType = mime.contentType(originalPath);

    if (!ContentType) {
      throw new AppError('File not found!');
    }

    const content = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: uploadConfig.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: content,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.aws.bucket,
        Key: file,
      })
      .promise();
  }
}
