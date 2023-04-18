import 'mocha'
import { expect } from 'chai'
import { RequestType, FunkoApp } from '../../src/Ejercicio-FunkoAPP/AppFunko/FunkoApp.js'
import { Client } from '../../src/Ejercicio-FunkoAPP/AppFunko/Client.js'

describe('Funko App Tests', () => {
  const funkoApp: FunkoApp = new FunkoApp(4000)
  const client: Client = new Client(4000)
  describe('FunkoApp class tests', () => {
    it('FunkoApp debe ser una instancia de la clase FunkoApp', () => {
      expect(funkoApp).to.be.an.instanceof(FunkoApp)
    })
    it('FunkoApp debería tener una propiedad de puerto', () => {
      expect(funkoApp).to.have.property('port')
      expect(funkoApp.port).to.be.a('number')
    })
    it('FunkoApp debería tener una propiedad de servidor', () => {
      expect(funkoApp).to.have.property('server')
    })
  })

  describe('Client class tests', () => {
    it('Client debe ser una instancia de la clase Cliente', () => {
      expect(client).to.be.an.instanceof(Client)
    })
    it('Client debe tener una propiedad de socket', () => {
      expect(client).to.have.property('socket')
    })
    it('Client debe tener una propiedad de puerto', () => {
      expect(client).to.have.property('port')
      expect(client.port).to.be.a('number')
    })
    it('Client debe poder conectarse a un servidor, enviar un comando y recibir la salida', () => {
      const request: RequestType = {
        user: 'Edu',
        type: 'list',
      }
      client.connect(request, (response) => {
        expect(response.type).to.be.equal('list')
        expect(response.success).to.be.false
        funkoApp.stop()
      })
    })
  })
})