# Proyecto SNMP - Gestión de Dispositivos y Puertos

## Descripción

Este proyecto implementa una aplicación que interactúa con dispositivos de red a través del protocolo **SNMP (Simple Network Management Protocol)**. La aplicación permite gestionar los puertos de un switch, cambiar el estado administrativo de cada uno de ellos, y visualizar información sobre los puertos no lógicos en una interfaz de usuario interactiva.

### Características principales:

- **Cambio dinámico de IP**: Se puede modificar la IP del dispositivo al que se está conectando la aplicación mediante la URL.
- **Visualización de la imagen del switch**: Al iniciar la aplicación, se muestra una representación gráfica del switch con los puertos coloreados según su estado.
  - **Naranja**: Puerto administrativamente DOWN.
  - **Rojo**: Puerto administrativamente UP, pero sin dispositivo conectado.
  - **Verde**: Puerto administrativamente UP, y con dispositivo conectado.
- **Información detallada de puertos**: Al pasar el ratón sobre los puertos lógicos, se muestra un **tooltip** con detalles del puerto, como el nombre, la descripción y un botón para cambiar su estado administrativo.
- **Tabla de puertos no lógicos**: En la parte inferior de la interfaz, se muestra una tabla con información sobre los puertos no lógicos del switch.

## Instalación

### Requisitos previos

Para ejecutar este proyecto en tu máquina local, necesitas tener instalados los siguientes programas:

- **Node.js**: [Instalar Node.js](https://nodejs.org/)
- **Git**: [Instalar Git](https://git-scm.com/)

### Pasos para la instalación

1. Clona el repositorio en tu máquina local:

   ```bash
   git clone https://github.com/javierpolorivas/Back_Snmp.git
Navega a la carpeta del proyecto:

bash
Copiar
Editar
cd Back_Snmp
Instala las dependencias necesarias:

bash
Copiar
Editar
npm install
Configura las variables de entorno necesarias, como la URL de la API y las credenciales SNMP.

Ejecuta el proyecto:

bash
Copiar
Editar
npm run start
Esto iniciará el servidor y la aplicación estará accesible en http://localhost:3000.

## Uso

La aplicación permite interactuar con dispositivos de red que soportan SNMP. Puedes realizar las siguientes acciones:

### 1. Cambiar la IP del dispositivo

En la URL de la aplicación, puedes modificar la dirección IP del dispositivo de red al que te estás conectando. La IP se pasa como un parámetro en la consulta.

### 2. Ver la imagen del switch

Al iniciar la aplicación, se mostrará una imagen representativa del switch en el que cada puerto está coloreado según su estado administrativo:

- **Naranja**: Puerto administrativamente down.
- **Rojo**: Puerto administrativamente up, pero no conectado.
- **Verde**: Puerto administrativamente up y conectado a un dispositivo.

### 3. Información de los puertos

Al pasar el ratón sobre los puertos lógicos de la interfaz, aparecerá un tooltip con el nombre del puerto, su descripción y un botón para cambiar su estado administrativo.

### 4. Tabla de puertos no lógicos

Debajo de la imagen del switch, se muestra una tabla con los puertos no lógicos del dispositivo, permitiendo acceder a información adicional de cada puerto.

# Documentación de la API SNMP

## Endpoints de la API

### 1. GET /snmp/get
Este endpoint permite obtener el estado de un puerto en un dispositivo de red utilizando SNMP. Devuelve la información sobre el puerto solicitado.

#### Parámetros de consulta:
- **ip**: Dirección IP del dispositivo.
- **oid**: OID (Identificador de objeto) del puerto.
- **version**: Versión de SNMP, por defecto es v2.
- **x-snmp-community**: Comunidad SNMP del dispositivo (autenticación).

#### Ejemplo de llamada:

```bash
GET /snmp/get?ip=192.168.1.1&oid=1.3.6.1.2.1.2.2.1.7.10002&version=v2
```

**Respuesta:**
```json
[
  {
    "oid": "1.3.6.1.2.1.2.2.1.7.10002",
    "type": "Integer",
    "value": 1
  }
]
```

### 2. GET /snmp/get-next
Este endpoint permite obtener el siguiente valor del OID proporcionado, útil para recorrer los valores de OID en un dispositivo.

#### Parámetros de consulta:
- **ip**: Dirección IP del dispositivo.
- **oid**: OID (Identificador de objeto) del puerto.
- **version**: Versión de SNMP, por defecto es v2.
- **x-snmp-community**: Comunidad SNMP del dispositivo (autenticación).

#### Ejemplo de llamada:
```bash
GET /snmp/get-next?ip=192.168.1.1&oid=1.3.6.1.2.1.2.2.1.7.10002&version=v2
```

**Respuesta:**
```json
[
  {
    "oid": "1.3.6.1.2.1.2.2.1.7.10003",
    "type": "Integer",
    "value": 2
  }
]
```

### 3. POST /snmp/set
Este endpoint permite modificar el estado administrativo de un puerto en el dispositivo de red.

#### Parámetros de consulta:
- **ip**: Dirección IP del dispositivo.
- **oid**: OID del puerto.
- **value**: Nuevo estado administrativo (1 para up, 2 para down).
- **type**: Tipo de valor, en este caso es Integer.
- **x-snmp-community**: Comunidad SNMP del dispositivo.

#### Ejemplo de llamada:
```bash
POST /snmp/set?version=v2&x-snmp-community=public
```

**Body del request:**
```json
{
  "ip": "192.168.1.1",
  "oid": "1.3.6.1.2.1.2.2.1.7.10002",
  "value": 2,
  "type": "Integer"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Estado del puerto actualizado correctamente."
}
```

### 4. GET /snmp/walk
Este endpoint permite realizar una caminata SNMP, obteniendo los valores de todos los OID bajo el OID base proporcionado.

#### Parámetros de consulta:
- **ip**: Dirección IP del dispositivo.
- **oid**: OID base de donde empezar la caminata.
- **version**: Versión de SNMP, por defecto es v2.
- **x-snmp-community**: Comunidad SNMP del dispositivo (autenticación).

#### Ejemplo de llamada:
```bash
GET /snmp/walk?ip=192.168.1.1&oid=1.3.6.1.2.1.2.2.1.7&version=v2
```

**Respuesta:**
```json
[
  {
    "oid": "1.3.6.1.2.1.2.2.1.7.10002",
    "type": "Integer",
    "value": 1
  },
  {
    "oid": "1.3.6.1.2.1.2.2.1.7.10003",
    "type": "Integer",
    "value": 2
  }
]
```

# Contribuciones

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama: 
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz commit de ellos: 
   ```bash
   git commit -am 'Añadir nueva funcionalidad'
   ```
4. Haz push a tu rama: 
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Crea un pull request describiendo los cambios realizados.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

# Información Adicional

## Autor
- **Nombre:** Javier Polo
- **Email:** javierpolorvs@gmail.com
