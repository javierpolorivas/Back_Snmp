import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleScopeService } from './sample-module/sampleScope.service';
import { SampleController } from './sample-module/sample.controller';
import { RequestService } from './request/request.service';
import { ProjectCacheService } from './auth/projectCache.service';
import { AuthCacheService } from './auth/authCache.service';
import { HttpModule } from '@nestjs/axios';
import { SnmpModule } from './snmp/snmp.module';

@Module({
  imports: [HttpModule, SnmpModule],
  controllers: [AppController, SampleController],
  providers: [AppService, SampleScopeService, RequestService, ProjectCacheService, AuthCacheService],
})
export class AppModule {}
