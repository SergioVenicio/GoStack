import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const base_path = path.resolve(__dirname, '..', '..');
const uploads_folder = path.resolve(base_path, 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmp_directory: string;
  upload_directory: string;
  multer: {
    storage: StorageEngine;
  };
  aws: {
    bucket: string;
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,
  tmp_directory: uploads_folder,
  upload_directory: path.resolve(base_path, 'uploads'),
  multer: {
    storage: multer.diskStorage({
      destination: uploads_folder,
      filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const filename = `${fileHash}-${file.originalname}`;

        return callback(null, filename);
      },
    }),
  },
  aws: {
    bucket: 'filesgobarber',
  },
} as IUploadConfig;
