import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { PlantsModule } from './plants/plants.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { GeminiModule } from './gemini/gemini.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { PhaseModule } from './phase/phase.module';
import { CareInstructionModule } from './care_instruction/care_instruction.module';
import { UserPlantModule } from './user_plant/user_plant.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    UsersModule,
    TasksModule,
    PlantsModule,
    RolesModule,
    CategoriesModule,
    GeminiModule,
    FileUploadModule,
    PhaseModule,
    CareInstructionModule,
    UserPlantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
