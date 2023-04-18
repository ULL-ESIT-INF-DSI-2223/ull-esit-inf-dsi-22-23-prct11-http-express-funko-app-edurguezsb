import net from 'net';
import { spawn } from 'child_process';

/**
 * Creamos un servidor que escucha en el puerto 8100 y espera recibir mensajes JSON desde un cliente.
 * Cuando se recibe un mensaje que tiene el campo 'type' establecido en 'command', ejecuta el comando
 * especificado en el campo 'com' junto con los parámetros especificados en el campo 'param'.
 * El resultado de la ejecución del comando se envía de vuelta al cliente a través de la conexión.
 */
net.createServer((connection) => {
  connection.on('data', (data) => {
    // Convertir los datos recibidos en un objeto JavaScript utilizando JSON.parse.
    let mensaje = JSON.parse(data.toString());

    // Si el mensaje recibido es un comando, ejecutarlo y enviar la salida de vuelta al cliente.
    if(mensaje.type == 'command') {
      console.log("Se ejecutara el comando: " + mensaje.com + " " + mensaje.param);
      let salida;
      if(mensaje.param == undefined) {
        // Si no hay parámetros, solo se ejecuta el comando.
        salida = spawn(mensaje.com);
      } else {
        // Si hay parámetros, se pasan como argumentos al comando.
        salida = spawn(mensaje.com, [mensaje.param]);
      }

      // Enviar cualquier salida de error del comando de vuelta al cliente a través de la conexión.
      salida.stderr.on('data', (data) => {
        connection.write(data.toString());
      });

      // Enviar cualquier salida estándar del comando de vuelta al cliente a través de la conexión.
      salida.stdout.on('data', (data) => {
        connection.write(data.toString());
      });
    }
  });

  // Cuando se cierra la conexión, imprimir un mensaje en la consola.
  connection.on('close' , () => {
    console.log('Cliente ha sido desconectado');
  });

// Escuchar en el puerto 8100 y imprimir un mensaje en la consola cuando el servidor está listo.
}).listen(8100, () => {
  console.log('Servidor a la espera escuchando puerto 8100');
});