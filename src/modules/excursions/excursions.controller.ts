import { Controller, Get, Post, Body, Patch, Param, Delete, } from '@nestjs/common';
import { ExcursionsService } from './excursions.service';
import { CreateExcursionDto } from './dto/create-excursion.dto';
import { UpdateExcursionStatusDto } from './dto/update-excursion-status.dto';
import { UpdateExcursionDto } from './dto/update-excursion.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('excursions')
export class ExcursionsController {
  constructor(private readonly excursionsService: ExcursionsService) {}

  @Post()
  create(@Body() createExcursionDto: CreateExcursionDto) {
    return this.excursionsService.create(createExcursionDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.excursionsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.excursionsService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExcursionDto: UpdateExcursionDto) {
    return this.excursionsService.update(+id, updateExcursionDto);
  }


  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateExcursionStatusDto: UpdateExcursionStatusDto) {
    return this.excursionsService.updateStatus(+id, updateExcursionStatusDto);
  }

  @Get(':id/detailed')
  findAllDetailed(@Param('id') id: string) {
    return this.excursionsService.findAllDetailed(+id);
  }
}
