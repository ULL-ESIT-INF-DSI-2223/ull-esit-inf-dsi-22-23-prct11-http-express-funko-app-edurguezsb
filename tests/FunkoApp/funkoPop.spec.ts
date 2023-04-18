import 'mocha'
import { expect } from 'chai'
import { FunkoType } from '../../src/Ejercicio-FunkoAPP/Funko/Type.js'
import { FunkoGenre } from '../../src/Ejercicio-FunkoAPP/Funko/Genre.js'
import { FunkoPop } from '../../src/Ejercicio-FunkoAPP/Funko/FunkoPop.js'

const Chucky = new FunkoPop(
    0,
    'Chucky',
    'Chucky Muñeco Diabolico',
    FunkoType.POP,
    FunkoGenre.MOVIES_AND_TV,
    'Miedo',
    0
  )

describe('Funko class tests', () => {
  it('Funkos debe tener diferentes tipos y géneros', () => {
    expect(FunkoType).to.be.a('object')
    expect(FunkoGenre).to.be.a('object')
  })
  it('Funkos debe tener una identificación única', () => {
    expect(Chucky.id).to.be.a('number')
    expect(Chucky.id).to.equal(0)
  })
  it('Funkos debería tener un nombre', () => {
    expect(Chucky.name).to.be.a('string')
    expect(Chucky.name).to.equal('Chucky')
  })
  it('Funkos debe tener una descripción', () => {
    expect(Chucky.description).to.be.a('string')
    expect(Chucky.description).to.equal(
      'Chucky Muñeco Diabolico'
    )
  })
  it('Funkos debe tener un tipo', () => {
    expect(Chucky.type).to.be.a('string')
    expect(Chucky.type).to.equal(FunkoType.POP)
  })
  it('Funkos debería tener un género', () => {
    expect(Chucky.genre).to.be.a('string')
    expect(Chucky.genre).to.equal(FunkoGenre.MOVIES_AND_TV)
  })
  it('Funkos debería tener una marca', () => {
    expect(Chucky.brand).to.be.a('string')
    expect(Chucky.brand).to.equal('Miedo')
  })
  it('Funkos debería tener una identificación única en su marca', () => {
    expect(Chucky.brandId).to.be.a('number')
    expect(Chucky.brandId).to.equal(0)
  })
  it('Funkos debería tener un precio de mercado', () => {
    Chucky.marketPrice = 20
    expect(Chucky.marketPrice).to.be.a('number')
    expect(Chucky.marketPrice).to.equal(20)
  })
  it('Los Funkos pueden ser exclusivos', () => {
    Chucky.exclusive = true
    expect(Chucky.exclusive).to.be.a('boolean')
    expect(Chucky.exclusive).to.equal(true)
  })
})