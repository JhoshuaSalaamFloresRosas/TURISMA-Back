import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { ExcursionsService } from './excursions.service';
import { CreateExcursionDto } from './dto/create-excursion.dto';
import { UpdateExcursionStatusDto } from './dto/update-excursion-status.dto';
import { UpdateExcursionDto } from './dto/update-excursion.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ExcursionEntity } from './entities/excursion.entity';

@ApiBearerAuth()
@ApiTags('Excursiones')
@Controller('excursions')
export class ExcursionsController {
  constructor(private readonly excursionsService: ExcursionsService) { }

  //**************************************************************** Usuario */
  /**
   * Funcion para mostrar informacion resumida de las excursiones
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener todas las excursiones' })
  @ApiCreatedResponse({
    description: 'Lista de excursiones.',
    type: [ExcursionEntity],
  })
  findAll() {
    return this.excursionsService.findAll();
  }

  /**
   * Informacion especifica de una excursion
   * @param id 
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una excursión por ID' })
  @ApiParam({ name: 'id', description: 'ID de la excursión', type: String })
  @ApiCreatedResponse({
    description: 'Información de la excursión.',
    type: ExcursionEntity,
  })
  findOne(@Param('id') id: string) {
    return this.excursionsService.findOne(+id);
  }

  //**************************************************************** Administrador */
  /**
   * Agregar una excursion
   * @param createExcursionDto 
   * @returns 
   */
  @ApiOperation({ summary: 'Agregar una excursión' })
  @ApiBody({ type: CreateExcursionDto })
  @ApiCreatedResponse({
    description: 'La excursión ha sido agregada exitosamente.',
    type: ExcursionEntity,
  })
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createExcursionDto: CreateExcursionDto) {
    return this.excursionsService.create(createExcursionDto);
  }

  /**
   * Actualizar una excursion
   * @param id 
   * @param updateExcursionDto 
   * @returns 
   */
  @ApiOperation({ summary: 'Actualizar una excursión' })
  @ApiParam({ name: 'id', description: 'ID de la excursión', type: String })
  @ApiBody({ type: UpdateExcursionDto })
  @ApiCreatedResponse({
    description: 'La excursión ha sido actualizada exitosamente.',
    type: ExcursionEntity,
  })
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExcursionDto: UpdateExcursionDto) {
    return this.excursionsService.update(+id, updateExcursionDto);
  }

  /**
   * Cambiar de estado una excursion
   * @param id 
   * @param updateExcursionStatusDto 
   * @returns 
   */
  @ApiOperation({ summary: 'Actualizar el estado de una excursión' })
  @ApiParam({ name: 'id', description: 'ID de la excursión', type: String })
  @ApiBody({ type: UpdateExcursionStatusDto })
  @ApiCreatedResponse({
    description: 'El estado de la excursión ha sido actualizado exitosamente.',
    type: ExcursionEntity,
  })
  @UseGuards(RolesGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateExcursionStatusDto: UpdateExcursionStatusDto) {
    return this.excursionsService.updateStatus(+id, updateExcursionStatusDto);
  }

  /**
   * Obtener toda la informacion de una excursion junto con relaciones 
   * @returns 
   */
  @ApiOperation({ summary: 'Obtener información detallada de una excursión' })
  @ApiParam({ name: 'id', description: 'ID de la excursión', type: String })
  @ApiCreatedResponse({
    description: 'Información detallada de la excursión.',
    type: ExcursionEntity,
  })
  @UseGuards(RolesGuard)
  @Get(':id/detailed')
  findAllDetailed(@Param('id') id: string) {
    return this.excursionsService.findAllDetailed(+id);
  }

  /**
   * Ruta para cancelar una excursión.
   * @param id - ID de la excursión a cancelar.
   * @returns Un mensaje indicando si la excursión fue cancelada.
   */
  @ApiOperation({ summary: 'Cancelar una excursión' })
  @ApiParam({ name: 'id', description: 'ID de la excursión', type: String })
  @ApiCreatedResponse({
    description: 'La excursión ha sido cancelada exitosamente.',
  })
  @UseGuards(RolesGuard)
  @Patch(':id/cancel')
  cancelExcursion(@Param('id') id: string) {
    return this.excursionsService.cancelExcursion(+id);
  }

  /**
   * Funcion para like
   * @param id 
   * @param req 
   * @returns 
   */
  @ApiOperation({ summary: 'Dar o quitar like a una excursión' })
  @ApiParam({ name: 'id', description: 'ID de la excursión', type: String })
  @ApiCreatedResponse({
    description: 'El estado del like ha sido cambiado exitosamente.',
  })
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.excursionsService.toggleLike(+id, userId);
  }
}
