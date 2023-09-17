import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Collage } from './entities/collage.entity';
import { CollageImage } from './entities/collageImage.entity';
import { AddImageDto } from './dto/addImage.dto';

import { FileService } from '../file/file.service';
import { UpdateImageDto } from './dto/updateImage.dto';

@Injectable()
export class CollageService {
  constructor(
    @Inject('COLLAGE_REPOSITORY')
    private collageRepo: Repository<Collage>,
    @Inject('COLLAGE_IMAGE_REPOSITORY')
    private collageImageRepo: Repository<CollageImage>,
    private fileService: FileService,
  ) {}

  public async getById(id: string) {
    return await this.collageRepo.findOne({
      where: { id },
      relations: { images: true },
    });
  }

  public async getByName(name: string) {
    const collage = await this.collageRepo.findOne({
      where: { name: name },
      relations: { images: true },
    });

    if (!collage) {
      // создаем коллаж
      return this.create(name);
    }

    return collage;
  }

  private async create(name: string) {
    const collage = this.collageRepo.create({
      name,
      images: [],
    });

    return await this.collageRepo.save(collage);
  }

  // добавление и замена картинок
  public async addImage(dto: AddImageDto, file: Express.Multer.File) {
    const collage = await this.getByName(dto.collageName);

    const newImage = await this.createImage(+dto.imagePosition, collage, file);

    // заменяем картинку, если на такой позиции она уже есть
    let added = false;
    collage.images.forEach((image, index) => {
      if (image.position === newImage.position) {
        collage.images[index] = newImage;
        added = true;
      }
    });

    if (!added) {
      collage.images.push(newImage);
    }

    const updated = await this.collageRepo.save({
      id: collage.id,
      images: collage.images,
    });

    return await this.collageRepo.findOne({
      where: { id: updated.id },
      relations: { images: true },
    });
  }

  private async createImage(
    position: number,
    collage: Collage,
    file: Express.Multer.File,
  ) {
    const filepath = file ? await this.fileService.createFile(file) : null;

    const image = this.collageImageRepo.create({
      collage,
      position,
      src: filepath,
      x: 0,
      y: 0,
    });

    const added = await this.collageImageRepo.save(image);

    return await this.collageImageRepo.findOne({ where: { id: added.id } });
  }

  public async updateImage(id: string, dto: UpdateImageDto) {
    const updated = await this.collageImageRepo.save({
      id,
      x: dto.x,
      y: dto.y,
    });

    return await this.collageImageRepo.findOne({
      where: { id: updated.id },
      relations: { collage: true },
    });
  }
}
