import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeminiService } from './gemini.service';
import { FileUploadService } from '@/file-upload/file-upload.service';
import { GetAIMessageDTO } from './dto/get-ai-response.dto';
import { GetAIScanResultDTO } from './dto/get-scan-result.dto';

@ApiTags('Gemini')
@Controller('gemini')
export class GeminiController {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly uploadFileService: FileUploadService,
  ) {}

  @ApiOperation({ summary: 'Generate AI response from prompt' })
  @ApiResponse({ status: 200, description: 'Return AI generated text' })
  @Post('prompt')
  getResponse(@Body() data: GetAIMessageDTO) {
    return this.geminiService.generateText(data);
  }

  @ApiOperation({ summary: 'Analyze an image and generate a caption' })
  @ApiResponse({ status: 200, description: 'Return AI generated caption' })
  @Post('image')
  analyzeImage(@Body() data: GetAIScanResultDTO) {
    return this.geminiService.analyzeImageUrl(data);
  }

  @ApiOperation({ summary: 'Upload an image and get AI description' })
  @ApiResponse({ status: 200, description: 'Return AI generated description' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const uploadResult =
      await this.uploadFileService.handleFileUploadToGoogle(file);
    return this.geminiService.analyzeUploadedFile(
      uploadResult.fileUri,
      uploadResult.mimeType,
    );
  }
}
