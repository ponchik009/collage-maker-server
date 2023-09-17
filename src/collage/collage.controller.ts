import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CollageService } from './collage.service';
import { AddImageDto } from './dto/addImage.dto';
import { UpdateImageDto } from './dto/updateImage.dto';

@Controller('collage')
export class CollageController {
  constructor(private collageService: CollageService) {}

  @Get(':name')
  async getByName(@Param('name') name: string) {
    return this.collageService.getByName(name);
  }

  @Post('addImage')
  @UseInterceptors(FileInterceptor('file'))
  addImage(
    @Body() dto: AddImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.collageService.addImage(dto, file);
  }

  @Patch('updateImage/:id')
  updateImage(@Body() dto: UpdateImageDto, @Param('id') id: string) {
    return this.collageService.updateImage(id, dto);
  }
}
