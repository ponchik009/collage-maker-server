import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CollageImage } from './collageImage.entity';

@Entity()
export class Collage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => CollageImage, (image) => image.collage)
  images: CollageImage[];
}
