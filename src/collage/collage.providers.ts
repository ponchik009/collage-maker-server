import { DataSource } from 'typeorm';
import { Collage } from './entities/collage.entity';
import { CollageImage } from './entities/collageImage.entity';

export const collageProviders = [
  {
    provide: 'COLLAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Collage),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'COLLAGE_IMAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CollageImage),
    inject: ['DATA_SOURCE'],
  },
];
