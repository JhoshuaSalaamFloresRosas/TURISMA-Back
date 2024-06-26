import { Test, TestingModule } from '@nestjs/testing';
import { StoppointsController } from './stoppoints.controller';
import { StoppointsService } from './stoppoints.service';

describe('StoppointsController', () => {
  let controller: StoppointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoppointsController],
      providers: [StoppointsService],
    }).compile();

    controller = module.get<StoppointsController>(StoppointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
