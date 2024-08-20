import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transport } from './entities/transport.entity';

//Decoradores de etiquetas de recursos
@ApiBearerAuth()
@ApiTags('Transportes')
@Controller('transports')
export class TransportsController {
  constructor(private readonly transportsService: TransportsService) { }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Creaciación de nuevo adquiler de transporte'})
  @ApiResponse({ status: 201, description: 'La nueva arrendación de transporte ha sido creado con exito.', type: Transport})
  @ApiResponse({ status: 400, description: 'Datos incorrectos!!'})
  create(@Body() createTransportDto: CreateTransportDto) {
    return this.transportsService.create(createTransportDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener todos los arrendamientos de transportes' })
  @ApiResponse({ status: 200, description: 'Lista de adquiler de transportes.', type: [Transport] })
  findAll() {
    return this.transportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener info de un transporte por ID' })
  @ApiResponse({ status: 200, description: 'Detalles del transporte.', type: Transport })
  @ApiResponse({ status: 404, description: 'Transporte no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.transportsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un transporte por ID' })
  @ApiResponse({ status: 200, description: 'El transporte ha sido actualizado.', type: Transport })
  @ApiResponse({ status: 404, description: 'Lo sentimos Transporte no encontrado.' })
  update(@Param('id') id: string, @Body() updateTransportDto: UpdateTransportDto) {
    return this.transportsService.update(+id, updateTransportDto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id/removeTransport')
  @ApiOperation({ summary: 'Eliminar un transporte por ID' })
  @ApiResponse({ status: 200, description: 'El transporte ha sido eliminado.' })
  @ApiResponse({ status: 404, description: 'Transporte no encontrado.' })
  @ApiResponse({ status: 400, description: 'El transporte no puede ser eliminado debido a relaciones existentes.' })
  removeTransport(@Param('id') id: string) {
    return this.transportsService.remove(+id);
  }
}