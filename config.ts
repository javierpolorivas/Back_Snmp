// config.ts
export const config = {

    modulo: "-1", //MODULO DE LA APLICACIÓN REGISTRADO EN LA BD DE AUTH, CAMBIAR POR EL MODULO CORRESPONDIENTE


  // Añadir la configuración de los backs necesarias --------------------------------------------------------

    authDB:{
      url: 'http://10.236.197.7/auth/api',
    },
    
    backEjemplo:{
      url: 'http://ejemplo.com/api',
    }

  };