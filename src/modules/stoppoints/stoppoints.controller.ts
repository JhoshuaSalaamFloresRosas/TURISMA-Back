import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { StoppointsService } from './stoppoints.service';
import { CreateStoppointDto } from './dto/create-stoppoint.dto';
import { UpdateStoppointDto } from './dto/update-stoppoint.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('stoppoints')
export class StoppointsController {
  constructor(private readonly stoppointsService: StoppointsService) {}

  @Public()
  @Post(':id')
  create(@Param('id', ParseIntPipe) id: number ,@Body() createStoppointDto: CreateStoppointDto) {
    return this.stoppointsService.create(id, createStoppointDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.stoppointsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stoppointsService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStoppointDto: UpdateStoppointDto) {
    return this.stoppointsService.update(id, updateStoppointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stoppointsService.remove(+id);
  }
}
