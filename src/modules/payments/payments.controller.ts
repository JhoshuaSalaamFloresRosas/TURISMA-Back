import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentEntity } from './payment-entity';

@ApiBearerAuth()
@ApiTags('Payment')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({summary: 'Crear un pago completo'})
  @ApiCreatedResponse({type: PaymentEntity})
  @Public()
  @Post('complete/:id')
  async createComplete(@Param('id', ParseIntPipe) id: number, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createComplete(id, createPaymentDto);
  }

  @ApiOperation({summary: 'Crear un pago parcial'})
  @ApiCreatedResponse({type: PaymentEntity})
  @Public()
  @Post('partial/:id')
  createPartial(@Param ('id', ParseIntPipe) id: number, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPartial(id, createPaymentDto);
  }

  @ApiOperation({summary: 'Actualizar estado de pendiente a completo'})
  @ApiCreatedResponse({type: PaymentEntity})
  @Public()
  @Patch(':id')
  updateStatus(@Param ('id', ParseIntPipe) id: number){
    return this.paymentsService.updateStatus(id)
  }


  /*
  @Post()
  createPartial(@Body() createPaymentDto: CreatePaymentDto){
    
  }


  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }*/
}
