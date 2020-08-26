import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const uploads_folder = path.resolve(__dirname, '..', '..', 'uploads');

export default {
  directory: uploads_folder,
  storage: multer.diskStorage({
    destination: uploads_folder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
