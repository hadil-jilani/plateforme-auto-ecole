import { Test, TestingModule } from '@nestjs/testing';
import { FormateursController } from './formateurs.controller';
import { FormateursService } from './formateurs.service';

describe('FormateursController', () => {
  let formateursController: FormateursController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FormateursController],
      providers: [FormateursService],
    }).compile();

    formateursController = app.get<FormateursController>(FormateursController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(formateursController.getHello()).toBe('Hello World!');
    });
  });
});
