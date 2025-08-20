/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { faker } from '@faker-js/faker';

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('create-user', async () => {
  await User.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })
})
