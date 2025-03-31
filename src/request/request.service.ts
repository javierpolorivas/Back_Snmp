import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import axios from 'axios';
import { config } from 'config';
import { ProjectCacheService } from 'src/auth/projectCache.service';


/**
 * Este servicio sirve para resolver las urls en base a al id de proyecto que viene en el header de la petición.
 * Para que funcione correctamente, deben ser llamados los métodos de inicialización en el interceptor de proyecto.
 * Las variable son llamadas desde otros sericios, que debn estar configurados para tener el scope de request.
 */


@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  
    baseurl = config.backEjemplo.url; //Cambiar por la de tu back real
    authUrl = config.authDB.url;
    currentProyect: any;
    requestUrl: string;
    serviceUrl: string;

  constructor(private cacheService: ProjectCacheService) {}

  async init(request: any) {
    const projectId = request.headers['projectid'];
    if (this.cacheService.hasProject(projectId)) {
      this.currentProyect = this.cacheService.getProject(projectId);
    } else {
      const authProject = (await axios.get(`${this.authUrl}/proyectos/${projectId}`)).data.nombre;
      this.currentProyect = authProject;
      
      // Almacenar en la caché
      this.cacheService.setProject(projectId, this.currentProyect);
    }

  }


}