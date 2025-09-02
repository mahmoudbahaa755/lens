import User from '#models/user'
import { faker } from '@faker-js/faker';

export default class UsersController {
  public async create() {
    await User.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })
  }
}
