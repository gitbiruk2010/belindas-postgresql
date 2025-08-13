import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmissionForm } from '../entities/submission-form.entity';
import { CreateSubmissionFormDto } from '../dto/create-submission-form.dto';

@Injectable()
export class SubmissionFormService {
  constructor(
    @InjectRepository(SubmissionForm)
    private readonly submissionFormRepository: Repository<SubmissionForm>,
  ) {}

  async create(createSubmissionFormDto: CreateSubmissionFormDto): Promise<SubmissionForm> {
      const newForm = this.submissionFormRepository.create(createSubmissionFormDto);
      return await this.submissionFormRepository.save(newForm);
  }

  async findAll(): Promise<SubmissionForm[]> {
    return this.submissionFormRepository.find();
  }
}
