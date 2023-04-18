/**
 * Librerías necesarias para la ejecución del script
 */
import {readFile} from 'fs';
import {spawn} from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

/**
 * Configuración de las opciones del script a través de yargs
 */
yargs(hideBin(process.argv))
  /**
   * Opciones de tipo booleano: l, w, m
   */
  .boolean(['l', 'w', 'm'])
  /**
   * Definición del comando "wc"
   * Descripción: cuenta las palabras de un archivo de texto
   * Parámetro obligatorio: nombre del archivo a contar
   */
  .command('wc', 'word count of a text file', {
    file: {
      description: 'the file\'s name',
      type: 'string',
      demandOption: true
    }
  }, (argv) => {
    /**
     * Lee el archivo especificado y verifica si existe
     */
    readFile(argv.file, (err) => {
      if (err) {
        console.log(`No existe el fichero ${argv.file}`)
      }

      /**
       * Ejecuta el comando "wc" en la terminal con el archivo especificado
       */
      const wc = spawn('wc', [argv.file]);

      let wcOutput = '';
      /**
       * Captura la salida del comando "wc"
       */
      wc.stdout.on('data', (data) => wcOutput += data);

      /**
       * Muestra los resultados según las opciones seleccionadas
       */
      wc.on('close', () => {
        const wcOutputArray = wcOutput.split(" ");        
        if (argv.l) {
          console.log(`El fichero ${argv.file} tiene ${wcOutputArray[1]} líneas.`);
        }
        if (argv.w) {
          console.log(`El fichero ${argv.file} tiene ${wcOutputArray[3]} palabras.`);
        }
        if (argv.m) {
          console.log(`El fichero ${argv.file} tiene ${wcOutputArray[4]} caracteres.`);
        }
        if (argv.l === undefined && argv.w === undefined && argv.m === undefined) {
          console.log('No ha utilizado ninguna de las opciones posibles (--l, --w, --m)');
        }
      });

      /**
       * Muestra un mensaje de error si ocurre un problema al ejecutar el comando "wc"
       */
      wc.on('error', (err) => {
        console.error('Error al ejecutar el comando', err);
      });
    })
  })
  /**
   * Muestra la ayuda del script
   */
  .help()
  .argv;
