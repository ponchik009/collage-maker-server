import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Collage } from './collage.entity';

@Entity()
export class CollageImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  position: number;

  @Column({ nullable: false, default: 0, type: 'float' })
  x: number;

  @Column({ nullable: false, default: 0, type: 'float' })
  y: number;

  @Column({ nullable: false })
  src: string;

  @ManyToOne(() => Collage, (collage) => collage.images)
  @JoinColumn()
  collage: Collage;
}
