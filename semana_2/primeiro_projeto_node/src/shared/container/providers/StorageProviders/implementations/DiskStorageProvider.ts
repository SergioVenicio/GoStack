import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmp_directory, file),
      path.resolve(uploadConfig.upload_directory, file)
    );
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const file_path = path.resolve(uploadConfig.upload_directory, file);

    try {
      fs.promises.unlink(file_path);
    } catch {
      return;
    }
  }
}
