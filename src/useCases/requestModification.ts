import { EventBus, Repository } from '@core/domain'
import { okAsync, err, ok, errAsync } from 'neverthrow'
import { User } from '@entities'
import { FileContents, FileObject } from '@modules/file'
import { Project } from '@modules/project'

interface MakeUseCaseProps {
  fileRepo: Repository<FileObject>
  eventBus: EventBus
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: Repository<Project>
}

interface RequestCommon {
  user: User
  file?: {
    contents: FileContents
    filename: string
  }
  projectId: string
  numeroGestionnaire?: string
}

interface AbandonRequest {
  type: 'abandon'
  justification: string
}

interface RecoursRequest {
  type: 'recours'
  justification: string
}

type CallUseCaseProps = RequestCommon & (AbandonRequest | RecoursRequest)

class Error1 extends Error {}
class Error2 extends Error {}

function test() {
  return ok(null).andThen(() => {
    if (1 === 1 / 2) {
      return err(new Error1())
    }

    return ok<null, Error2>(null)
  })
}

function testAsync() {
  return okAsync(null).andThen(() => {
    if (1 === 1 / 2) {
      return errAsync(new Error1())
    }

    return okAsync<null, Error2>(null)
  })
}
