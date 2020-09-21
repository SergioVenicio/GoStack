import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const base_path = path.resolve(__dirname, '..', '..');
const uploads_folder = path.resolve(base_path, 'tmp');

export default {
  tmp_directory: uploads_folder,
  upload_directory: path.resolve(base_path, 'uploads'),
  storage: multer.diskStorage({
    destination: uploads_folder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
