import { FunkoType } from './Type.js';
import { FunkoGenre } from './Genre.js';

/**
 * Interfaz para representar la información básica de un Funko Pop.
 */
export interface BasicFunkoPopInfo {
  /**
   * Identificador del Funko Pop.
   */
  id: number;

  /**
   * Nombre del Funko Pop.
   */
  name: string;

  /**
   * Descripción del Funko Pop.
   */
  description: string;

  /**
   * Tipo del Funko Pop.
   */
  type: FunkoType;

  /**
   * Género del Funko Pop.
   */
  genre: FunkoGenre;
}

/**
 * Clase abstracta que representa la información básica de un Funko Pop.
 * Esta clase implementa la interfaz BasicFunkoPopInfo.
 */
export abstract class BasicFunkoPop implements BasicFunkoPopInfo {
  /**
   * Constructor de la clase BasicFunkoPop.
   * @param id Identificador del Funko Pop.
   * @param name Nombre del Funko Pop.
   * @param description Descripción del Funko Pop.
   * @param type Tipo del Funko Pop.
   * @param genre Género del Funko Pop.
   */
  constructor(
    public readonly id: number,
    public name: string,
    public description: string,
    public type: FunkoType,
    public genre: FunkoGenre,
  ) {}
}
