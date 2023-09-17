import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { resolve } from 'path';

import { DatabaseModule } from './database/database.module';
import { CollageModule } from './collage/collage.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.prod', '.env.local'],
    }),
    CollageModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
