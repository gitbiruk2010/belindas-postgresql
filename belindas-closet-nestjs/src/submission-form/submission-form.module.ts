import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionFormController } from './controllers/submission-form.controller';
import { SubmissionFormService } from './services/submission-form.service';
import { SubmissionForm } from './entities/submission-form.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubmissionForm]),
  ],
  controllers: [SubmissionFormController],
  providers: [SubmissionFormService],
})
export class SubmissionFormModule {}
