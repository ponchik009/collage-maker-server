import { Module } from '@nestjs/common';

import { CollageService } from './collage.service';
import { CollageController } from './collage.controller';
import { collageProviders } from './collage.providers';

import { DatabaseModule } from '../database/database.module';
import { FileModule } from '../file/file.module';
import { CollageGateway } from './collage.gateway';

@Module({
  imports: [DatabaseModule, FileModule],
  providers: [CollageService, ...collageProviders, CollageGateway],
  controllers: [CollageController],
})
export class CollageModule {}
