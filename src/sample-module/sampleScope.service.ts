import { Injectable, Scope } from '@nestjs/common';
import { RequestService } from 'src/request/request.service';

@Injectable({scope: Scope.REQUEST})
export class SampleScopeService {

  constructor(private requestService: RequestService) {}

  getData(): string {
    return 'Hola! Tu proyecto es: ' + this.requestService.currentProyect;
  }
}
