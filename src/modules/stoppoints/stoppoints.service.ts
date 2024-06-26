import { Injectable } from '@nestjs/common';
import { CreateStoppointDto } from './dto/create-stoppoint.dto';
import { UpdateStoppointDto } from './dto/update-stoppoint.dto';

@Injectable()
export class StoppointsService {
  create(createStoppointDto: CreateStoppointDto) {
    return 'This action adds a new stoppoint';
  }

  findAll() {
    return `This action returns all stoppoints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stoppoint`;
  }

  update(id: number, updateStoppointDto: UpdateStoppointDto) {
    return `This action updates a #${id} stoppoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} stoppoint`;
  }
}
