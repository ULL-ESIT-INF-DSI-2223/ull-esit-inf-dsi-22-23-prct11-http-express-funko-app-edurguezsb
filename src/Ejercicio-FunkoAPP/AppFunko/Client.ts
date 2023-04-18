import net from 'net'
import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { FunkoPop } from '../Funko/FunkoPop.js'
import { RequestType, ResponseType } from './FunkoApp.js'
import { checkType, checkGenre, createFunko } from './Helpers.js'

/**
 * Representa las opciones que un usuario puede pasar como argumentos a la línea de comandos.
 */
interface UserOptions {
  user: string
}

/**
 * Representa las opciones básicas que un usuario puede pasar como argumentos a la línea de comandos.
 */
interface BasicOptions {
  user: string
  id_: number
}

/**
 * Representa todas las opciones que un usuario puede pasar como argumentos a la línea de comandos.
 */
interface Options extends BasicOptions {
  name: string
  desc: string
  type: string
  genre: string
  brand: string
  brandId: number
  price: number
  exclusive: boolean
}

/**
 * Crea y devuelve una opción para ser usada en la línea de comandos.
 *
 * @param desc - La descripción de la opción.
 * @param tp - El tipo de la opción.
 * @param demand - Indica si la opción es obligatoria o no.
 * @returns La opción creada.
 */
function FillOption(desc: string, tp: string, demand: boolean) {
  const option = {}
  Object.assign(option, {
    description: desc,
    type: tp,
    demandOption: demand,
  })
  return option
}

/**
 * Agrega la opción 'user' a la línea de comandos.
 *
 * @param yargs - La instancia de yargs a la que se agrega la opción.
 * @returns La instancia de yargs con la opción agregada.
 */
const UserData = (yargs: yargs.Argv<UserOptions>) => {
  return yargs.option('user', FillOption('User name', 'string', true))
}

/**
 * Agrega las opciones 'user' e 'id' a la línea de comandos.
 *
 * @param yargs - La instancia de yargs a la que se agregan las opciones.
 * @returns La instancia de yargs con las opciones agregadas.
 */
const BasicData = (yargs: yargs.Argv<BasicOptions>) => {
  return yargs
    .option('user', FillOption('User name', 'string', true))
    .option('id', FillOption('Funko ID', 'number', true))
}

/**
 * Agrega todas las opciones a la línea de comandos.
 *
 * @param yargs - La instancia de yargs a la que se agregan las opciones.
 * @returns La instancia de yargs con las opciones agregadas.
 */

const FunkoData = (yargs: yargs.Argv<Options>) => {
  return yargs
    .option('user', FillOption('User name', 'string', true))
    .option('id', FillOption('Funko ID', 'number', true))
    .option('name', FillOption('Funko name', 'string', true))
    .option('desc', FillOption('Funko description', 'string', true))
    .option('type', FillOption('Funko type', 'string', true))
    .option('genre', FillOption('Funko genre', 'string', true))
    .option('brand', FillOption('Funko brand', 'string', true))
    .option('brandId', FillOption('Funko brand ID', 'number', true))
    .option('price', FillOption('Funko price', 'number', true))
    .option('exclusive', FillOption('Funko exclusive', 'boolean', false))
}

/**
 * Representa un cliente que se comunica con un servidor utilizando sockets para realizar operaciones CRUD en figuras Funko Pop.
 */
export class Client {
    /**
     * El socket utilizado para comunicarse con el servidor.
     */
    public socket = new net.Socket()
  
    /**
     * Crea una nueva instancia de cliente con las opciones especificadas.
     *
     * @param port - El número de puerto al que se conectará el cliente.
     * @param request - La solicitud inicial para enviar al servidor.
     */
    public constructor(
      public port = -1,
      public request: RequestType = { type: 'unknown', user: '' }
    ) {
      // Crea una interfaz de línea de comando para analizar la entrada del usuario
      const commands = yargs(process.argv.slice(2))
        // Agrega un comando para agregar una nueva figura Funko Pop
        .command('add', 'Agrega una figura Funko Pop', FunkoData, (argv) => {
          if (argv.type && !checkType(argv.type as string)) return
          if (argv.genre && !checkGenre(argv.genre as string)) return
          const funko = createFunko(argv)
          this.request = {
            user: argv.user as string,
            type: 'add',
            funkoPop: funko,
          }
        })
        // Agrega un comando para actualizar una figura Funko Pop existente
        .command('update', 'Actualiza una figura Funko Pop', FunkoData, (argv) => {
          if (argv.type && !checkType(argv.type as string)) return
          if (argv.genre && !checkGenre(argv.genre as string)) return
  
          const funko = createFunko(argv)
          this.request = {
            user: argv.user as string,
            type: 'update',
            funkoPop: funko,
          }
        })
        // Agrega un comando para eliminar una figura Funko Pop existente
        .command('remove', 'Elimina una figura Funko Pop', BasicData, (argv) => {
          this.request = {
            user: argv.user as string,
            type: 'remove',
            id: argv.id as number,
          }
        })
        // Agrega un comando para listar todas las figuras Funko Pop existentes
        .command('list', 'Lista todas las figuras Funko Pop', UserData, (argv) => {
          this.request = {
            user: argv.user as string,
            type: 'list',
          }
        })
        // Agrega un comando para buscar una figura Funko Pop por su ID
        .command('search', 'Busca una figura Funko Pop por su ID', BasicData, (argv) => {
          this.request = {
            user: argv.user as string,
            type: 'search',
            id: argv.id as number,
          }
        })
        .help()
  
      // Analiza los argumentos de la línea de comando si se proporcionan, de lo contrario muestra la ayuda
      if (process.argv.length > 2) commands.parse()
      else commands.showHelp()

    if (this.port < 0) console.log(chalk.red('Puerto no válido'))
  }


  /**
   * Se conecta al servidor a través de un socket, envía una solicitud y llama al callback con la respuesta.
   * @param {RequestType} request - La solicitud que se enviará al servidor.
   * @param {(response: ResponseType) => void} callback - La función que se llamará con la respuesta del servidor.
   * @returns {void}
   */
  public connect(
    request: RequestType,
    callback: (response: ResponseType) => void
  ) {
    this.socket.connect(this.port, 'localhost', () => {
      console.log(chalk.blue(`Client connected to port ${this.port}`));
      this.processCommand(request, (response) => {
        if (response) {
          this.socket.end();
          callback(response);
        }
      });
    });
  }

  /**
   * Procesa una solicitud y llama al callback con la respuesta del servidor.
   * @param {RequestType} request - La solicitud que se enviará al servidor.
   * @param {(response: ResponseType | undefined) => void} callback - La función que se llamará con la respuesta del servidor.
   * @returns {void}
   */
  private processCommand(
    request: RequestType,
    callback: (response: ResponseType | undefined) => void
  ) {
    if (request.type === 'unknown') {
      console.log(chalk.red('Unknown command'))
      callback(undefined)
    }
    console.log(
      chalk.blue(`Sending request to server: ${JSON.stringify(request)}`)
    )
    this.socket.write(JSON.stringify(request) + '\n')
    let data = ''
    this.socket.on('data', (chunk) => {
      data += chunk.toString()
    })
    this.socket.on('end', () => {
      const response: ResponseType = JSON.parse(data)
      switch (response.type) {
        case 'add':
          if (response.success)
            console.log(chalk.green('Funko added successfully'))
          else console.log(chalk.red('Already exists a funko with that ID'))
          break
        case 'update':
          if (response.success)
            console.log(chalk.green('Funko updated successfully'))
          else console.log(chalk.red('There is no funko with that ID'))
          break
        case 'remove':
          if (response.success)
            console.log(chalk.green('Funko removed successfully'))
          else console.log(chalk.red('There is no funko with that ID'))
          break
        case 'list':
          if (response.success) {
            if (response.funkoPops === undefined) return
            response.funkoPops.forEach((funko) => {
              FunkoPop.print(funko)
            })
          } else console.log(chalk.red('There are no funkos'))
          break
        case 'search':
          if (response.success) {
            if (response.funkoPops === undefined) return
            FunkoPop.print(response.funkoPops[0])
          } else console.log(chalk.red('There is no funko with that ID'))
          break
        default:
          console.log(chalk.red('Invalid response'))
      }
      callback(response)
    })
  }
}