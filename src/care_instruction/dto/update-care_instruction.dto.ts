import { PartialType } from '@nestjs/swagger';
import { CreateCareInstructionDto } from './create-care_instruction.dto';

export class UpdateCareInstructionDto extends PartialType(
  CreateCareInstructionDto,
) {}
