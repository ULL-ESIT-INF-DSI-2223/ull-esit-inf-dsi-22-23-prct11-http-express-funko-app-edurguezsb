/**
 * Este módulo utiliza el paquete yargs para parsear argumentos de línea de comandos y opciones
 * para el comando wc (word count) de Linux para contar palabras, líneas y caracteres en un archivo de texto.
 * También utiliza los paquetes fs y child_process para leer el archivo y ejecutar comandos de shell, respectivamente.
 *
 * @packageDocumentation
 */

import {readFile} from 'fs';
import {spawn} from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Parsear argumentos de línea de comandos con yargs
yargs(hideBin(process.argv))
  .boolean(['l', 'w', 'm']) // Opciones booleanas que indican qué tipo de recuento de palabras se debe hacer
  .command('wc', 'word count of a text file', { // Comando "wc" para contar palabras de un archivo de texto
    file: { // Argumento requerido que especifica el archivo a procesar
      description: 'the file\'s name',
      type: 'string',
      demandOption: true
    }
  }, (argv) => { // Función que se ejecuta cuando se llama al comando "wc"
    readFile(argv.file, (err) => { // Leer el archivo especificado en el argumento
      if (err) {
        console.log(`No existe el fichero ${argv.file}`)
      }

      if (argv.l) {     
        const wcl = spawn('wc', ['-l', argv.file]);     
        const cut = spawn('cut', ['-d', ' ', '-f', '1']); 

        wcl.stdout.pipe(cut.stdin);
        cut.stdout.pipe(process.stdout);
      }

      if (argv.w) {        
        const wcw = spawn('wc', ['-w', argv.file]);     
        const cut = spawn('cut', ['-d', ' ', '-f', '1']); 

        wcw.stdout.pipe(cut.stdin);
        cut.stdout.pipe(process.stdout);
      }

      if (argv.m) {
        const wcm = spawn('wc', ['-m', argv.file]);     
        const cut = spawn('cut', ['-d', ' ', '-f', '1']); 

        wcm.stdout.pipe(cut.stdin);
        cut.stdout.pipe(process.stdout);
      }

      if (argv.l === undefined && argv.w === undefined && argv.m === undefined) {
        console.log('No ha utilizado ninguna de las opciones posibles (--l, --w, --m)');
      }
    })
  })
  .help() // Mostrar la ayuda
  .argv; // Ejecutar el programa
