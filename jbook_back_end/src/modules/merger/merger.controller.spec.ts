import { Test, TestingModule } from '@nestjs/testing';
import { MergerController } from './merger.controller';
import { MergerService } from './merger.service';

describe('MergerController', () => {
  let controller: MergerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MergerController],
      providers: [MergerService],
    }).compile();

    controller = module.get<MergerController>(MergerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
