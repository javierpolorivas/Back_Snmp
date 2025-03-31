import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import * as jwt from 'jsonwebtoken';
import { AuthCacheService } from './authCache.service';
import { config } from 'config';
import { errorMonitor } from 'events';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly authCacheService: AuthCacheService
  ) {}

  modulo = config.modulo; //MODULO DE LA APLICACIÓN UTILIZÁNDOSE
  baseUrl: string = config.authDB.url; //URL DE LA API DE AUTH

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    const token = authorization?.split(' ')[1];
    const projectId = request.headers['projectid'];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // Verificar la caché
    const cachedData = this.authCacheService.get(token);

    let decodedToken;
    try {
      decodedToken = jwt.decode(token);
      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    let rol:any = cachedData?.accesos[this.modulo][projectId];

    if (cachedData && cachedData.username == decodedToken.username && rol) {
      
      return of(true);
    }

    const url = `${this.baseUrl}/auth/validateToken`;

    return this.httpService.get(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' } })
      .pipe(
        map((response: any) => {
          const userData = response.data;
          const validUser = userData.username == decodedToken.username;
          const accesos = userData.accesos;

          if(accesos[this.modulo] && accesos[this.modulo][projectId]){
            rol = accesos[this.modulo][projectId];
          }

          if ( validUser && rol) {
            // Almacenar en la caché con un tiempo de vida de 15 minutos
            this.authCacheService.set(token, userData);
            request.user = userData;
            return true;
          }else if(validUser){
            throw new UnauthorizedException('Tu usuario no tiene permisos para este módulo/proyecto');
          }else{
            throw new UnauthorizedException('Invalid token');
          }
        }),
        catchError((error) => {
          console.error('Error validating token:', error.message);
          console.error('Error details:', error.response?.data || error);
          throw new UnauthorizedException(error.message);
        })
      );
  }
}