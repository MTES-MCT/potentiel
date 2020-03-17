import { setWorldConstructor, setDefaultTimeout } from 'cucumber'
import { Page } from 'puppeteer'

import { User, Project } from '../../src/entities'

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

  async navigateTo(route, options) {
    await this.page.goto(route, options)
  }
}

setWorldConstructor(World)
