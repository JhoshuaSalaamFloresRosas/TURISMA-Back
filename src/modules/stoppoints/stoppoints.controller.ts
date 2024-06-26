import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoppointsService } from './stoppoints.service';
import { CreateStoppointDto } from './dto/create-stoppoint.dto';
import { UpdateStoppointDto } from './dto/update-stoppoint.dto';

@Controller('stoppoints')
export class StoppointsController {
  constructor(private readonly stoppointsService: StoppointsService) {}

  @Post()
  create(@Body() createStoppointDto: CreateStoppointDto) {
    return this.stoppointsService.create(createStoppointDto);
  }

  @Get()
  findAll() {
    return this.stoppointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stoppointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoppointDto: UpdateStoppointDto) {
    return this.stoppointsService.update(+id, updateStoppointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stoppointsService.remove(+id);
  }
}
