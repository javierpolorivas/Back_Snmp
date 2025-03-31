import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';

@Injectable()
export class ProjectCacheService {
  private projectCache: LRUCache<string, any>;

  constructor() {
    // Inicializamos el cache con un máximo de 10 proyectos y una duración máxima de 1 hora
    this.projectCache = new LRUCache<string, any>({
      max: 10, // Número máximo de proyectos a almacenar
      ttl: 1000 * 300, // Duración máxima de 1 hora (ttl en milisegundos)
    });
  }

  getProject(projectId: string): any {
    return this.projectCache.get(projectId);
  }

  setProject(projectId: string, projectData: any): void {
    this.projectCache.set(projectId, projectData);
  }

  hasProject(projectId: string): boolean {
    return this.projectCache.has(projectId);
  }
}