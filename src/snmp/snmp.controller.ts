import { Controller, Get, Post, Body, Query, Headers, UseGuards } from '@nestjs/common';
import { SnmpService } from './snmp.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('snmp')
export class SnmpController {
  constructor(private readonly snmpService: SnmpService) {}

  @Get('get')
  getValue(
    @Query('ip') ip: string,
    @Query('oid') oid: string,
    @Query('version') version: string,
    @Headers('x-snmp-community') community: string,
  ) {
    return this.snmpService.get(ip, community, oid, version || 'v2');
  }

  @Get('get-next')
  getNextValue(
    @Query('ip') ip: string,
    @Query('oid') oid: string,
    @Query('version') version: string,
    @Headers('x-snmp-community') community: string,
  ) {
    return this.snmpService.getNext(ip, community, oid, version || 'v2');
  }

  @Post('set')
  setValue(
    @Body() body: { ip: string; oid: string; value: any; type: string },
    @Query('version') version: string,
    @Headers('x-snmp-community') community: string,
  ) {
    const result = this.snmpService.set(body.ip, community, body.oid, body.value, body.type, version || 'v2');
    console.log(result);
    return result
  }

  @Get('walk')
  walk(
    @Query('ip') ip: string,
    @Query('oid') oid: string,
    @Query('version') version: string,
    @Headers('x-snmp-community') community: string,
  ) {
    return this.snmpService.walkSimulated(ip, community, oid, version || 'v2');
  }



}
