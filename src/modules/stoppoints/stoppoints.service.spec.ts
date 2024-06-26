import { Test, TestingModule } from '@nestjs/testing';
import { StoppointsService } from './stoppoints.service';

describe('StoppointsService', () => {
  let service: StoppointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoppointsService],
    }).compile();

    service = module.get<StoppointsService>(StoppointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
