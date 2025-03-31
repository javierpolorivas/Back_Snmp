import { Injectable } from '@nestjs/common';
import * as snmp from 'net-snmp';

@Injectable()
export class SnmpService {
  private getVersion(version: string): snmp.Version {
    return version === 'v1' ? snmp.Version1 : snmp.Version2c;
  }

  get(ip: string, community: string, oid: string, version: string): Promise<any> {
    const session = snmp.createSession(ip, community, { version: this.getVersion(version) });

    return new Promise((resolve, reject) => {
      session.get([oid], (error, varbinds) => {
        session.close();
        if (error) return reject(error);

        const result = varbinds.map(vb => ({
          oid: vb.oid,
          type: snmp.ObjectType[vb.type],
          value: this.parseValue(vb.value),
        }));
        resolve(result);
      });
    });
  }

  getNext(ip: string, community: string, oid: string, version: string): Promise<any> {
    const session = snmp.createSession(ip, community, { version: this.getVersion(version) });

    return new Promise((resolve, reject) => {
      session.getNext([oid], (error, varbinds) => {
        session.close();
        if (error) return reject(error);

        const result = varbinds.map(vb => ({
          oid: vb.oid,
          type: snmp.ObjectType[vb.type],
          value: this.parseValue(vb.value),
        }));
        resolve(result);
      });
    });
  }

  set(ip: string, community: string, oid: string, value: any, type: string, version: string): Promise<any> {
    const session = snmp.createSession(ip, community, { version: this.getVersion(version) });

    const varbind = [{
      oid,
      type: snmp.ObjectType[type],
      value,
    }];

    return new Promise((resolve, reject) => {
      session.set(varbind, (error, varbinds) => {
        session.close();
        if (error) return reject(error);
        resolve({ success: true, response: varbinds });
      });
    });
  }

  async walkSimulated(ip: string, community: string, oid: string, version: string): Promise<any[]> {
    const session = snmp.createSession(ip, community, {
      version: this.getVersion(version),
      timeout: 3000,
      retries: 1,
    });

    // Si termina en ".0", eliminamos para trabajar sobre la rama
    const baseOid = oid.endsWith('.0') ? oid.slice(0, -2) : oid;
  
    const results: any[] = [];
    let currentOid = baseOid;
  
    try {
      while (true) {
        const varbinds: snmp.VarBind[] = await new Promise((resolve, reject) => {
          session.getNext([currentOid], (error, vb) => {
            if (error) return reject(error);
            return resolve(vb);
          });
        });
  
        const varbind = varbinds[0];
  
        if (!varbind || snmp.isVarbindError(varbind)) break;
        if (!varbind.oid || !varbind.oid.startsWith(baseOid)) break;
  
        results.push({
          oid: varbind.oid,
          type: snmp.ObjectType[varbind.type],
          value: this.parseValue(varbind),
        });
  
        currentOid = varbind.oid;
      }
    } catch (err) {
      console.error('SNMP walkSimulated error:', err.message);
      // No cerramos aquí porque puede ser que la sesión ya esté cerrada
    } finally {
      try {
        session.close(); // hacemos el close de forma segura
      } catch (err) {
        // si ya estaba cerrada, lo ignoramos
      }
    }
  
    return results;
  }
  
  
  
  private parseValue(varbind: snmp.VarBind) {
    // formato limpio de valores
    if (varbind.type === snmp.ObjectType.OctetString && Buffer.isBuffer(varbind.value)) {
      return varbind.value.toString('utf-8');
    }
    return varbind.value;
  }
  
}
