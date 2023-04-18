import chalk from 'chalk'
import yargs from 'yargs'
import { FunkoType } from '../Funko/Type.js'
import { FunkoGenre } from '../Funko/Genre.js'
import { FunkoPop } from '../Funko/FunkoPop.js'


/**
 * Función que verifica si el tipo de Funko es válido.
 * @param type Tipo de Funko.
 * @returns Devuelve `true` si el tipo es válido, `false` en caso contrario.
 */
export function checkType(type: string): boolean {
    if (Object.values(FunkoType).indexOf(type as FunkoType) === -1) {
      console.log(chalk.red('Invalid type')); // Imprime en consola un mensaje de error en rojo.
      return false;
    }
    return true;
  }
  
  /**
   * Función que verifica si el género de Funko es válido.
   * @param genre Género de Funko.
   * @returns Devuelve `true` si el género es válido, `false` en caso contrario.
   */
  export function checkGenre(genre: string): boolean {
    if (Object.values(FunkoGenre).indexOf(genre as FunkoGenre) === -1) {
      console.log(chalk.red('Invalid genre')); // Imprime en consola un mensaje de error en rojo.
      return false;
    }
    return true;
  }
  
  /**
   * Función que crea un nuevo FunkoPop a partir de los argumentos pasados en `argv`.
   * @param argv Argumentos desde la línea de comandos.
   * @returns Devuelve un nuevo objeto `FunkoPop`.
   */
  export function createFunko(argv: yargs.Arguments): FunkoPop {
    return new FunkoPop(
      argv.id as number,
      argv.name as string,
      argv.desc as string,
      argv.type as FunkoType,
      argv.genre as FunkoGenre,
      argv.brand as string,
      argv.brandId as number,
      argv.price as number
    );
  }