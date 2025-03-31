import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { SampleScopeService } from './sampleScope.service';
import { ProjectInterceptor } from 'src/interceptors/project.interceptor';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('sample')
export class SampleController {
  constructor(private readonly appService: SampleScopeService) {}

  @Get('byProject')
  @UseInterceptors(ProjectInterceptor)
  getDataByProjectId(): string {
    return this.appService.getData();
  }

  @Get('byAuth')
  @UseGuards(AuthGuard)
  getDataByAuth(): string {
    return "Te has autenticado correctamente!!";
  }

}
