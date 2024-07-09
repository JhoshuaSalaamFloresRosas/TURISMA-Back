import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('complete/:id')
  createComplete(@Param ('id', ParseIntPipe) id: number, @Body() createPaymentDto: CreatePaymentDto) {
    createPaymentDto.reservationId = id
    return this.paymentsService.createComplete(createPaymentDto);
  }

  @Public()
  @Post('partial/:id')
  createPartial(@Param ('id', ParseIntPipe) id: number, @Body() createPaymentDto: CreatePaymentDto) {
    createPaymentDto.reservationId = id
    return this.paymentsService.createPartial(createPaymentDto);
  }

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
