import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { StoppointsService } from './stoppoints.service';
import { CreateStoppointDto } from './dto/create-stoppoint.dto';
import { UpdateStoppointDto } from './dto/update-stoppoint.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { StopPoint } from './entities/stoppoint.entity';

@ApiTags('Stop Points')
@Controller('stoppoints')
export class StoppointsController {
  constructor(private readonly stoppointsService: StoppointsService) {}

  @Public()
  @Post(':id')
  @ApiOperation({ summary: 'Crear un punto de parada para una excursión' })
  @ApiParam({ name: 'id', description: 'ID de la excursión', type: Number })
  @ApiBody({ type: CreateStoppointDto })
  @ApiResponse({ status: 201, description: 'Punto de parada creado exitosamente', type: StopPoint })
  @ApiResponse({ status: 404, description: 'Excursión no encontrada' })
  create(@Param('id', ParseIntPipe) id: number, @Body() createStoppointDto: CreateStoppointDto) {
    return this.stoppointsService.create(id, createStoppointDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener todos los puntos de parada' })
  @ApiResponse({ status: 200, description: 'Lista de todos los puntos de parada', type: [StopPoint] })
  findAll() {
    return this.stoppointsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un punto de parada por ID' })
  @ApiParam({ name: 'id', description: 'ID del punto de parada', type: Number })
  @ApiResponse({ status: 200, description: 'Detalles del punto de parada', type: StopPoint })
  @ApiResponse({ status: 404, description: 'Punto de parada no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stoppointsService.findOne(id);
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un punto de parada por ID' })
  @ApiParam({ name: 'id', description: 'ID del punto de parada', type: Number })
  @ApiBody({ type: UpdateStoppointDto })
  @ApiResponse({ status: 200, description: 'Punto de parada actualizado exitosamente', type: StopPoint })
  @ApiResponse({ status: 404, description: 'Punto de parada no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStoppointDto: UpdateStoppointDto) {
    return this.stoppointsService.update(id, updateStoppointDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un punto de parada por ID' })
  @ApiParam({ name: 'id', description: 'ID del punto de parada', type: Number })
  @ApiResponse({ status: 200, description: 'Punto de parada eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Punto de parada no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stoppointsService.remove(id);
  }
}
