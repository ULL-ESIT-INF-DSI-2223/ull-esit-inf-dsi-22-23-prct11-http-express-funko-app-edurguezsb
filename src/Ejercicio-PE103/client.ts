import net from 'net';

/**
 * Crear una instancia de un cliente de conexión TCP/IP mediante la librería 'net'.
 * Conectar el cliente al puerto 8100.
 */
const client = net.connect({port: 8100});

/**
 * Se ejecuta cuando el cliente establece conexión con éxito.
 * Envía un comando al servidor en formato JSON, basado en los argumentos proporcionados al invocar el script.
 */
client.on('connect' , () => {
  if (process.argv.length < 3) { 
    // Si no se proporciona ningún comando al invocar el script, se muestra un error y se finaliza el proceso.
    console.log("Error: No se ha introducido ningún comando");
    process.exit(1);
  }
  // Enviar un objeto JSON al servidor, indicando el tipo de comando, el comando en sí mismo y un parámetro (si se proporciona).
  client.write(JSON.stringify({'type': 'command', 'com': process.argv[2], 'param': process.argv[3]}));
});

/**
 * Se ejecuta cuando el cliente recibe datos del servidor.
 * Muestra los datos recibidos por la consola y finaliza la conexión.
 */
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});

/**
 * Se ejecuta cuando la conexión con el servidor se cierra.
 * Muestra un mensaje por consola indicando que el cliente se ha desconectado.
 */
client.on('close', () => {
  console.log('Cliente desconectado');
});