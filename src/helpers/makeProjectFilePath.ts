import sanitize from 'sanitize-filename'
import path from 'path'

const makeProjectFilePath = (
  projectId: string,
  originalFilename: string,
  keepFilename?: boolean
): { filename: string; filepath: string } => {
  // add timestamp to avoid duplicate file names
  const filename = keepFilename ? originalFilename : sanitize(`${Date.now()}-${originalFilename}`)
  const filepath = path.join('projects', projectId, filename)

  return { filename, filepath }
}

export { makeProjectFilePath }
