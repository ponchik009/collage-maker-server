import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export const FILES_DIRNAME = 'IMAGES';

@Injectable()
export class FileService {
  async createFile(file: Express.Multer.File) {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = resolve(__dirname, '..', 'static', FILES_DIRNAME);

      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }
      writeFileSync(resolve(filePath, fileName), file.buffer);

      return FILES_DIRNAME + '/' + fileName;
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
