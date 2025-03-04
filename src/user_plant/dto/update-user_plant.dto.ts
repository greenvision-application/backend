import { PartialType } from '@nestjs/swagger';
import { CreateUserPlantDto } from './create-user_plant.dto';

export class UpdateUserPlantDto extends PartialType(CreateUserPlantDto) {}
