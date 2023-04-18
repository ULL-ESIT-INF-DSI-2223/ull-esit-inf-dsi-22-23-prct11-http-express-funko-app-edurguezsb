import net from 'net';
import chalk from 'chalk';
import { FunkoPop } from '../Funko/FunkoPop.js';
import { User } from '../User/user.js';

/**
 * Operaciones que se pueden realizar en la aplicación
 */
export type Operation =
  | 'add'
  | 'update'
  | 'remove'
  | 'search'
  | 'list'
  | 'unknown';

/**
 * Tipos de solicitudes que se pueden hacer en la aplicación
 */
export type RequestType = {
  user: string; // Usuario que hace la solicitud
  type: Operation; // Tipo de operación que se va a realizar
  funkoPop?: FunkoPop; // Información del FunkoPop en caso de ser necesaria
  id?: number; // Identificador del FunkoPop en caso de ser necesario
};

/**
 * Tipos de respuestas que se pueden obtener en la aplicación
 */
export type ResponseType = {
  type: Operation; // Tipo de operación que se realizó
  success: boolean; // Indica si la operación se realizó correctamente
  funkoPops?: FunkoPop[]; // Información de los FunkoPops en caso de ser necesario
};

/**
 * Clase que representa la aplicación de FunkoPops
 */
export class FunkoApp {
  public server: net.Server = new net.Server(); // Servidor de net

  /**
   * Constructor de la aplicación de FunkoPops
   * @param port Puerto en el que se va a iniciar el servidor
   */
  public constructor(public port = -1) {
    if (this.port >= 0) {
      this.start(); // Inicia el servidor
    } else {
      console.log(chalk.red('Invalid port')); // Muestra un mensaje de error en caso de que el puerto sea inválido
    }
  }

  /**
   * Método que inicia el servidor de la aplicación
   */
  public start(): void {
    this.server = net.createServer(this.handleConnection).listen(this.port, () => {
      console.log(chalk.green(`Server listening on port ${this.port}`)); // Muestra un mensaje en la consola indicando que el servidor está escuchando en un puerto específico
    });
  }

  /**
   * Método que maneja la conexión del servidor
   */
  private handleConnection = (connection: net.Socket): void => {
    console.log(chalk.yellow('Client connected'))
    let data = ''
    connection.on('data', (chunk) => {
      data += chunk.toString()
      if (data.includes('\n')) {
        const request: RequestType = JSON.parse(data)
        connection.write(JSON.stringify(this.proccessRequest(request)))
        connection.end()
        console.log(chalk.yellow('Client disconnected'))
      }
    })
  }

/**
 * Método privado para procesar una solicitud y devolver una respuesta
 * @param request - Tipo de solicitud a procesar
 * @returns Respuesta a la solicitud
 */
private proccessRequest = (request: RequestType): ResponseType => {
    // Se crea una instancia del usuario a partir de los datos de la solicitud
    const user = new User(request.user)
    // Se carga la colección del usuario
    user.load()
    // Se inicializa la respuesta como desconocida y sin éxito
    let response: ResponseType = { type: 'unknown', success: false }
    // Se ejecuta una acción en función del tipo de solicitud
    switch (request.type) {
      case 'add':
        response = this.processAdd(user, request.funkoPop)
        break
      case 'update':
        response = this.processUpdate(user, request.funkoPop)
        break
      case 'remove':
        response = this.processRemove(user, request.funkoPop)
        break
      case 'search':
        response = this.processSearch(user, request.funkoPop)
        break
      case 'list':
        response = this.processList(user)
        break
    }
    // Se guarda la colección actualizada del usuario
    user.save()
    // Se devuelve la respuesta a la solicitud
    return response
  }
  
  /**
   * Método privado para procesar la solicitud de añadir un FunkoPop a la colección de un usuario
   * @param user - Usuario al que se va a añadir el FunkoPop
   * @param funkoPop - FunkoPop que se va a añadir a la colección del usuario
   * @returns Respuesta a la solicitud de añadir un FunkoPop
   */
  private processAdd = (
    user: User,
    funkoPop: FunkoPop | undefined
  ): ResponseType => {
    // Si se proporciona un FunkoPop para añadir, se añade a la colección del usuario y se devuelve una respuesta de éxito o fracaso según el resultado
    if (funkoPop)
      return user.addFunko(funkoPop).includes('Already exists')
        ? { type: 'add', success: false }
        : { type: 'add', success: true }
    // Si no se proporciona un FunkoPop, se devuelve una respuesta de fracaso
    return { type: 'add', success: false }
  }
  
  /**
   * Método privado para procesar la solicitud de actualizar un FunkoPop en la colección de un usuario
   * @param user - Usuario al que se va a actualizar el FunkoPop
   * @param funkoPop - FunkoPop que se va a actualizar en la colección del usuario
   * @returns Respuesta a la solicitud de actualizar un FunkoPop
   */
  private processUpdate = (
    user: User,
    funkoPop: FunkoPop | undefined
  ): ResponseType => {
    // Si se proporciona un FunkoPop para actualizar, se actualiza en la colección del usuario y se devuelve una respuesta de éxito o fracaso según el resultado
    if (funkoPop)
      return user
        .updateFunko(funkoPop)
        .includes(`not in ${user.name}'s collection`)
        ? { type: 'update', success: false }
        : { type: 'update', success: true }
    // Si no se proporciona un FunkoPop, se devuelve una respuesta de fracaso
    return { type: 'update', success: false }
  }

    /**
     * Procesa la solicitud de eliminación de un FunkoPop de la colección de un usuario.
     * @param user - Usuario al que pertenece la colección.
     * @param funkoPop - FunkoPop que se desea eliminar.
     * @returns Objeto que indica si la operación fue exitosa o no.
     */
    private processRemove = (
      user: User,
      funkoPop: FunkoPop | undefined
    ): ResponseType => {
      if (funkoPop)
        return user
          .removeFunko(funkoPop.id)
          .includes(`not in ${user.name}'s collection`)
          ? { type: 'remove', success: false } // si el FunkoPop no fue encontrado, la operación no fue exitosa
          : { type: 'remove', success: true } // si el FunkoPop fue encontrado y eliminado, la operación fue exitosa
      return { type: 'remove', success: false } // si el parámetro funkoPop es undefined, la operación no fue exitosa
    }
  
    /**
     * Procesa la solicitud de búsqueda de un FunkoPop en la colección de un usuario.
     * @param user - Usuario al que pertenece la colección.
     * @param funkoPop - FunkoPop que se desea buscar.
     * @returns Objeto que indica si la operación fue exitosa o no, y opcionalmente los FunkoPops encontrados.
     */
    private processSearch = (
      user: User,
      funkoPop: FunkoPop | undefined
    ): ResponseType => {
      if (funkoPop)
        return user
          .searchFunko(funkoPop.id)
          .includes(`not in ${user.name}'s collection`)
          ? { type: 'search', success: false } // si el FunkoPop no fue encontrado, la operación no fue exitosa
          : { type: 'search', success: true, funkoPops: [funkoPop] } // si el FunkoPop fue encontrado, la operación fue exitosa y se devuelve en un arreglo
      return { type: 'search', success: false } // si el parámetro funkoPop es undefined, la operación no fue exitosa
    }
  
    /**
     * Procesa la solicitud de listar todos los FunkoPops de la colección de un usuario.
     * @param user - Usuario al que pertenece la colección.
     * @returns Objeto que indica si la operación fue exitosa o no, y opcionalmente los FunkoPops encontrados.
     */
    private processList = (user: User): ResponseType => {
      if (user.collection.length === 0) return { type: 'list', success: false } // si la colección del usuario está vacía, la operación no fue exitosa
      return { type: 'list', success: true, funkoPops: user.collection } // si la colección del usuario tiene elementos, la operación fue exitosa y se devuelve en un arreglo
    }
  
    /**
     * Detiene el servidor.
     */
    public stop(): void {
      this.server.close() // cierra el servidor
    }
  }
  