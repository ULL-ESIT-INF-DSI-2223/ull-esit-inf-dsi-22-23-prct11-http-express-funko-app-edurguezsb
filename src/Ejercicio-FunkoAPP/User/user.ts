import fs from 'fs';
import chalk from 'chalk';
import { FunkoPop } from '../Funko/FunkoPop.js';

/**
 * Interfaz que define los métodos y propiedades que debe tener un usuario.
 */
export interface UserInfo {
  /**
   * Nombre del usuario.
   */
  name: string;

  /**
   * Lista de Funko Pops de la colección del usuario.
   */
  collection: FunkoPop[];

  /**
   * Agrega un Funko Pop a la colección del usuario.
   * @param funkoPop Funko Pop a agregar a la colección.
   * @returns Un mensaje de éxito o error.
   */
  addFunko(funkoPop: FunkoPop): string;

  /**
   * Modifica un Funko Pop de la colección del usuario.
   * @param funkoPop Funko Pop modificado.
   * @returns Un mensaje de éxito o error.
   */
  updateFunko(funkoPop: FunkoPop): string;

  /**
   * Elimina un Funko Pop de la colección del usuario.
   * @param id ID del Funko Pop a eliminar.
   * @returns Un mensaje de éxito o error.
   */
  removeFunko(id: number): string;

  /**
   * Imprime en consola la lista de Funko Pops de la colección del usuario.
   */
  listFunkos(): void;

  /**
   * Busca un Funko Pop en la colección del usuario.
   * @param id ID del Funko Pop a buscar.
   * @returns Un mensaje de éxito o error.
   */
  searchFunko(id: number): string;

  /**
   * Guarda la colección del usuario en un archivo.
   */
  save(): void;

  /**
   * Carga la colección del usuario desde un archivo.
   */
  load(): void;
}

/**
 * Clase que implementa la interfaz UserInfo.
 */
export class User implements UserInfo {
  /**
   * Lista de Funko Pops de la colección del usuario.
   */
  public collection: FunkoPop[];

  /**
   * Crea un nuevo usuario.
   * @param name Nombre del usuario.
   * @param funkoPops Lista de Funko Pops para agregar a la colección del usuario.
   */
  constructor(public readonly name: string, ...funkoPops: FunkoPop[]) {
    this.collection = funkoPops;
  }

  /**
   * Agrega un Funko Pop a la colección del usuario.
   * @param funkoPop Funko Pop a agregar a la colección.
   * @returns Un mensaje de éxito o error.
   */
  public addFunko(funkoPop: FunkoPop): string {
    const notSameId = this.collection.filter((f) => f.id !== funkoPop.id)
    if (notSameId.length !== this.collection.length)
      return chalk.red(
        `Already exists a Funko Pop with id ${funkoPop.id} in ${this.name}'s collection`
      )
    this.collection.push(funkoPop)
    return chalk.green(`${funkoPop.name} added to ${this.name}'s collection`)
  }

  /**
   * Actualiza un FunkoPop en la colección.
   * @param funkoPop - El FunkoPop a actualizar.
   * @returns Un mensaje indicando si se ha actualizado el FunkoPop o si no se ha encontrado en la colección.
   */
  public updateFunko(funkoPop: FunkoPop): string {
    const notSameId = this.collection.filter((f) => f.id !== funkoPop.id)
    if (notSameId.length === this.collection.length)
      return chalk.red(
        `Funko Pop with id ${funkoPop.id} not in ${this.name}'s collection`
      )
    this.collection = this.collection.map((f) =>
      f.id === funkoPop.id ? funkoPop : f
    )
    return chalk.green(
      `Funko Pop with id ${funkoPop.id} modified in ${this.name}'s collection`
    )
  }

  /**
   * Elimina un FunkoPop de la colección.
   * @param id - El ID del FunkoPop a eliminar.
   * @returns Un mensaje indicando si se ha eliminado el FunkoPop o si no se ha encontrado en la colección.
   */
  public removeFunko(id: number): string {
    const notSameId = this.collection.filter((f) => f.id !== id)
    if (notSameId.length === this.collection.length)
      return chalk.red(
        `Funko Pop with id ${id} not in ${this.name}'s collection`
      )
    this.collection = notSameId
    return chalk.green(
      `Funko Pop with id ${id} removed from ${this.name}'s collection`
    )
  }
  /**
   * Busca un FunkoPop en la colección.
   * @param id - El ID del FunkoPop a buscar.
   * @returns Un mensaje indicando si se ha encontrado el FunkoPop o si no se ha encontrado en la colección.
   */
  public searchFunko(id: number): string {
    const notSameId = this.collection.filter((f) => f.id !== id)
    if (notSameId.length === this.collection.length)
      return chalk.red(
        `Funko Pop with id ${id} not in ${this.name}'s collection`
      )

    const result = this.collection.find((f) => f.id === id)
    if (result) FunkoPop.print(result)
    return chalk.green(
      `Funko Pop with id ${id} found in ${this.name}'s collection`
    )
  }

  public listFunkos(): void {
    this.collection.forEach((funkoPop) => FunkoPop.print(funkoPop))
  }


  /** 
   * Carga la colección de Funko Pops.
   * Si no existe la carpeta de datos, la crea.
   * Si no existe la carpeta con el nombre de la colección, la crea.
   * Lee los archivos json de los Funko Pops de la colección y los añade a la colección.
   * @memberof FunkoPopCollection
   */
  public load(): void {
    if (!fs.existsSync('./data')) fs.mkdirSync('./data'); // Crea la carpeta de datos si no existe
    const name = this.name.replace(/ /g, '_'); // Reemplaza espacios en blanco en el nombre de la colección con "_"
    if (!fs.existsSync(`./data/${name}`)) { // Crea la carpeta de la colección si no existe
      fs.mkdirSync(`./data/${name}`);
      return;
    }
    fs.readdirSync(`./data/${name}`).forEach((file) => { // Lee los archivos json de los Funko Pops de la carpeta de la colección
      if (file.match(/Funko-\d+.json/)) { // Selecciona solo los archivos que tienen un formato de nombre específico
        if (file !== undefined) {
          const fd = fs.readFileSync(`./data/${name}/${file}`, 'utf8');
          const funkoPop = JSON.parse(fd); // Parsea el contenido del archivo json en un objeto de FunkoPop
          this.collection.push(
            new FunkoPop(
              funkoPop.id,
              funkoPop.name,
              funkoPop.description,
              funkoPop.type,
              funkoPop.genre,
              funkoPop.brand,
              funkoPop.brandId,
              funkoPop.marketPrice,
              funkoPop.exclusive,
              funkoPop.especial
            )
          ); // Añade el objeto de FunkoPop a la colección
        }
      }
    });
  }

  /** 
   * Guarda la colección de Funko Pops.
   * Ordena la colección por id.
   * Reemplaza espacios en blanco en el nombre de la colección con "_".
   * Guarda cada Funko Pop de la colección en un archivo json en la carpeta de la colección.
   * @memberof FunkoPopCollection
   */
  public save(): void {
    this.collection.sort((a, b) => (a.id < b.id ? -1 : 1)); // Ordena la colección por id
    const name = this.name.replace(/ /g, '_'); // Reemplaza espacios en blanco en el nombre de la colección con "_"
    for (const funkoPop of this.collection) { // Itera por cada objeto de FunkoPop en la colección
      const data = JSON.stringify(funkoPop);
      fs.writeFileSync(`./data/${name}/Funko-${funkoPop.id}.json`, data); // Guarda cada FunkoPop en un archivo json con el formato de nombre específico en la carpeta de la colección
    }
  }
}