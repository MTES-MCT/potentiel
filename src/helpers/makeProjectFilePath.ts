import sanitize from 'sanitize-filename'
import path from 'path'

const makeProjectFilePath = (
  projectId: string,
  originalFilename: string,
  keepFilename?: boolean
): { filename: string; filepath: string } => {
  const filename = keepFilename ? originalFilename : sanitize(originalFilename)
  const filepath = path.join('projects', projectId, filename)

  return { filename, filepath }
}

export { makeProjectFilePath }
