import { PORT } from './config'

export default function (route: string) {
  return `http://localhost:${PORT}${route}`
}
