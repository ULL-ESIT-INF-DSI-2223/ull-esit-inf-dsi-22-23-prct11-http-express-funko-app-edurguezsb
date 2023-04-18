import 'mocha'
import { expect } from 'chai'
import chalk from 'chalk'
import { FunkoType } from '../../src/Ejercicio-FunkoAPP/Funko/Type.js'
import { FunkoGenre } from '../../src/Ejercicio-FunkoAPP/Funko/Genre.js'
import { FunkoPop } from '../../src/Ejercicio-FunkoAPP/Funko/FunkoPop.js'
import { User } from '../../src/Ejercicio-FunkoAPP/User/user.js'

const Chucky = new FunkoPop(
    0,
    'Chucky',
    'Chucky Muñeco Diabolico',
    FunkoType.POP,
    FunkoGenre.MOVIES_AND_TV,
    'Miedo',
    0
  )
  
  const Mickey_Mouse = new FunkoPop(
    1, 
    'Mickey Mouse',
    'The most famous character of Walt Disney',
    FunkoType.POP_BLACK_AND_WHITE,
    FunkoGenre.ANIMATION,
    'Disney',
    1
  )
  
  const Darth_Vader = new FunkoPop(
    2,
    'Darth Vader',
    'The most famous character of Star Wars',
    FunkoType.POP,
    FunkoGenre.MOVIES_AND_TV,
    'Star Wars',
    2
  )
  
  const The_Mandalorian = new FunkoPop(
    3,
    'The Mandalorian',
    'Important character of Starr Wars',
    FunkoType.POP,
    FunkoGenre.MOVIES_AND_TV,
    'Star Wars',
    3
  )
  
  const Michelangelo = new FunkoPop(
    4,
    'Michelangelo',
    'Una dee las 4 tortugas',
    FunkoType.POP,
    FunkoGenre.ANIMATION,
    'Tortugas Ninja',
    4)
  
  Chucky.marketPrice = 40
  Mickey_Mouse.marketPrice = 35
  Darth_Vader.marketPrice = 50
  The_Mandalorian.marketPrice = 15
  Michelangelo.marketPrice = 5
  
  const user = new User('Star Wars', Darth_Vader, The_Mandalorian)

  describe('User class', () => {
    it('Los usuarios deberían tener un nombre', () => {
      expect(user.name).to.be.a('string')
      expect(user.name).to.equal('Star Wars')
    });
    it('Los usuarios deberían tener una colección de Funkos', () => {
      expect(user.collection).to.be.a('array')
      expect(user.collection).to.have.lengthOf(2)
  })
  it('Los usuarios deberían poder agregar Funkos a su colección', () => {
    expect(user.addFunko(Chucky)).to.be.equal(
      chalk.green(
        Chucky.name +
          ' added to ' +
          user.name +
          "'s collection"
      )
    )
    expect(user.collection).to.have.lengthOf(3)
  })
  it('Los usuarios deben ser informados si intentan agregar un Funko que ya está en su colección', () => {
    expect(user.addFunko(Darth_Vader)).to.be.equal(
      chalk.red(
        'Already exists a Funko Pop with id ' +
          Darth_Vader.id +
          ' in ' +
          user.name +
          "'s collection"
      )
    )
    expect(user.collection).to.have.lengthOf(3)
  })
  it('Los usuarios deberían poder modificar un Funko si su identificación está en su colección', () => {
    Darth_Vader.name = 'Mickey Mouse modified'
    expect(user.updateFunko(Darth_Vader)).to.be.equal(
      chalk.green(
        'Funko Pop with id ' +
          Darth_Vader.id +
          ' modified in ' +
          user.name +
          "'s collection"
      )
    )
    expect(user.collection).to.have.lengthOf(3)
  })
  it('Los usuarios deben ser informados si intentan modificar un Funko que no está en su colección', () => {
    expect(user.updateFunko(Michelangelo)).to.be.equal(
      chalk.red(
        'Funko Pop with id ' +
          Michelangelo.id +
          ' not in ' +
          user.name +
          "'s collection"
      )
    )
    expect(user.collection).to.have.lengthOf(3)
  })
  it('Los usuarios deberían poder eliminar Funkos de su colección', () => {
    expect(user.removeFunko(Darth_Vader.id)).to.be.equal(
      chalk.green(
        'Funko Pop with id ' +
          Darth_Vader.id +
          ' removed from ' +
          user.name +
          "'s collection"
      )
    )
    expect(user.collection).to.have.lengthOf(2)
  })
  it('Los usuarios deben ser informados si intentan eliminar un Funko que no está en su colección', () => {
    expect(user.removeFunko(Michelangelo.id)).to.be.equal(
      chalk.red(
        'Funko Pop with id ' +
          Michelangelo.id +
          ' not in ' +
          user.name +
          "'s collection"
      )
    )
    expect(user.collection).to.have.lengthOf(2)
  })
})