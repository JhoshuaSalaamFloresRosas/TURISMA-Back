import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, } from '@nestjs/common';
import { ExcursionsService } from './excursions.service';
import { CreateExcursionDto } from './dto/create-excursion.dto';
import { UpdateExcursionStatusDto } from './dto/update-excursion-status.dto';
import { UpdateExcursionDto } from './dto/update-excursion.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('excursions')
export class ExcursionsController {
  constructor(private readonly excursionsService: ExcursionsService) {}

  @UseGuards(RolesGuard)
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
  /**
   * Ruta para obtener la informacion de todas las excursiones junto con sus usuarios que reservaron
   * @returns 
   */
  @UseGuards(RolesGuard)
  @Get(':id/detailed')
  findAllDetailed(@Param('id') id: string) {
    return this.excursionsService.findAllDetailed(+id);
  }
}
