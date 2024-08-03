import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, } from '@nestjs/common';
import { ExcursionsService } from './excursions.service';
import { CreateExcursionDto } from './dto/create-excursion.dto';
import { UpdateExcursionStatusDto } from './dto/update-excursion-status.dto';
import { UpdateExcursionDto } from './dto/update-excursion.dto';
import { Public } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('excursions')
export class ExcursionsController {
  constructor(private readonly excursionsService: ExcursionsService) { }
  //**************************************************************** Usuario */
  /**
   * Funcion para mostrar informacion resumidad de las excursioens
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Get()
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
  findOne(@Param('id') id: string) {
    return this.excursionsService.findOne(+id);
  }

  //**************************************************************** Administrador */
  /**
   * Agregar una excursion
   * @param createExcursionDto 
   * @returns 
   */
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
  @UseGuards(RolesGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateExcursionStatusDto: UpdateExcursionStatusDto) {
    return this.excursionsService.updateStatus(+id, updateExcursionStatusDto);
  }
  /**
   * Obtener toda la informacion de una excursion junto con relaciones 
   * @returns 
   */
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
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.excursionsService.toggleLike(+id, userId);
  }
}
