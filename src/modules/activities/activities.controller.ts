import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Activity } from './entities/activity.entity';

@ApiBearerAuth()
@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @ApiOperation({ summary: 'Registrar una actividad '})
  @ApiCreatedResponse({
    description: 'La actividad ha sido registrada exitosamente.',
    type: Activity})
  @Public()
  @Post(':id')
  create(@Param('id', ParseIntPipe)id: number, @Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(id, createActivityDto);
  }

  @ApiOperation({ summary: 'Obtener todas las actividades '})
  @ApiCreatedResponse({ type: Activity})
  @Public()
  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una actividad por ID '})
  @ApiCreatedResponse({ type: Activity})
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una actividad '})
  @ApiCreatedResponse({
    description: 'La actividad ha sido actualizada exitosamente.',
    type: Activity})
  @Public()
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.update(id, updateActivityDto);
  }

  @ApiOperation({ summary: 'Eliminar una actividad '})
  @ApiCreatedResponse({ 
    description: 'La actividad ha sido eliminada exitosamente.',
    type: Activity})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(+id);
  }
}
