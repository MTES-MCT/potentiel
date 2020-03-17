import { setWorldConstructor, setDefaultTimeout } from 'cucumber'
import { Page } from 'puppeteer'

import { User, Project } from '../../src/entities'
import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'

import makeRoute from './makeRoute'

setDefaultTimeout(30 * 1000)

export class World {
  userId: User['id']
  projects: Array<Project>

  public page: Page
  constructor() {
    // console.log('World constructor called')
  }

  async newPage() {
    this.page = await global['__BROWSER__'].newPage()
  }

  async getPage() {
    return await this.page
  }

  async navigateTo(route, options = {}) {
    await this.page.goto(route, options)
  }

  async loginAs({ email, password }) {
    await this.navigateTo(makeRoute(routes.LOGOUT_ACTION))
    await this.navigateTo(makeRoute(routes.LOGIN))

    await this.page.type(testId('login-email'), email)
    await this.page.type(testId('login-password'), password)

    await this.page.click(testId('login-submitButton'))
  }
}

setWorldConstructor(World)
