import { Test, TestingModule } from '@nestjs/testing';
import { MergerService } from './merger.service';

describe('MergerService', () => {
  let service: MergerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MergerService],
    }).compile();

    service = module.get<MergerService>(MergerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
