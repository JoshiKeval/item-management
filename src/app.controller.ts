import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor() {}

  @Get('/ping')
  ping() {
    return {
      isError: false,
      message: 'PONG',
      data: {},
    };
  }
}
