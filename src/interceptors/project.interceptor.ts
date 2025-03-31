import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class ProjectInterceptor implements NestInterceptor {
  constructor(private requestService:RequestService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // Convertir la promesa de init a un observable y luego continuar con el manejo de la petición.
    return from(this.requestService.init(request)).pipe(
      switchMap(() => next.handle())
    );
  }
}