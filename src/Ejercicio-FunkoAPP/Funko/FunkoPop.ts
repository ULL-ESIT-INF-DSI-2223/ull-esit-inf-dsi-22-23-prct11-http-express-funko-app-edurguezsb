import chalk from 'chalk';
import { BasicFunkoPop } from './BasicFunkoPop.js';
import { FunkoType } from './Type.js';
import { FunkoGenre } from './Genre.js';

/**
 * Interfaz que define la información básica de un FunkoPop
 * @interface
 */
export interface FunkoPopInfo {
  /** Marca del FunkoPop */
  brand: string;
  /** Identificador de la marca del FunkoPop */
  brandId: number;
  /** Precio de mercado del FunkoPop */
  marketPrice: number;
  /** Indica si el FunkoPop es exclusivo */
  exclusive: boolean;
  /** Información especial del FunkoPop */
  especial: string;
}

/**
 * Clase que representa un FunkoPop
 * @class
 */
export class FunkoPop extends BasicFunkoPop implements FunkoPopInfo {
  /**
   * Constructor de la clase FunkoPop
   * @constructor
   * @param {number} id - Identificador del FunkoPop
   * @param {string} name - Nombre del FunkoPop
   * @param {string} description - Descripción del FunkoPop
   * @param {FunkoType} type - Tipo del FunkoPop
   * @param {FunkoGenre} genre - Género del FunkoPop
   * @param {string} [brand=''] - Marca del FunkoPop
   * @param {number} [brandId=0] - Identificador de la marca del FunkoPop
   * @param {number} [marketPrice=0] - Precio de mercado del FunkoPop
   * @param {boolean} [exclusive=false] - Indica si el FunkoPop es exclusivo
   * @param {string} [especial=''] - Información especial del FunkoPop
   */
  constructor(
    id: number,
    name: string,
    description: string,
    type: FunkoType,
    genre: FunkoGenre,
    public brand = '',
    public brandId = 0,
    public marketPrice = 0,
    public exclusive = false,
    public especial: string = ''
  ) {
    super(id, name, description, type, genre);
  }

  /**
   * Método estático que imprime la información de un FunkoPop en la consola
   * @static
   * @param {FunkoPop} funko - FunkoPop que se desea imprimir en la consola
   * @returns {void}
   */
  public static print(funko: FunkoPop): void {
    console.table({
      id: funko.id,
      name: funko.name,
      description: funko.description,
      type: funko.type,
      genre: funko.genre,
      brand: funko.brand,
      brandId: funko.brandId,
      exclusive: funko.exclusive,
      especial: funko.especial,
    })
    if (funko.marketPrice < 10)
      console.log(chalk.greenBright(`Market Price: $${funko.marketPrice}`))
    else if (funko.marketPrice < 20)
      console.log(chalk.green(`Market Price: $${funko.marketPrice}`))
    else if (funko.marketPrice < 30)
      console.log(chalk.yellow(`Market Price: $${funko.marketPrice}`))
    else console.log(chalk.redBright(`Market Price: $${funko.marketPrice}`))
  }
}