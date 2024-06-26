import { PartialType } from '@nestjs/mapped-types';
import { CreateStoppointDto } from './create-stoppoint.dto';

export class UpdateStoppointDto extends PartialType(CreateStoppointDto) {}
