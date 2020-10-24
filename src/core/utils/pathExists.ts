import { promisify } from 'util'
import { access } from 'fs'

const accessPromisified = promisify(access)

/**
 * Check if a given path exists
 */
export const pathExists = async (path: string): Promise<boolean> => {
  let pathExists: boolean
  try {
    await accessPromisified(path)
    pathExists = true
  } catch (error) {
    pathExists = false
  }

  return pathExists
}
