import { PasswordRetrieval, makePasswordRetrieval } from '../entities'
import { PasswordRetrievalRepo, CredentialsRepo } from '../dataAccess'
import _ from 'lodash'
import { ResultAsync, ErrorResult, Ok } from '../types'
import routes from '../routes'

interface MakeUseCaseProps {
  passwordRetrievalRepo: PasswordRetrievalRepo
  credentialsRepo: CredentialsRepo
  sendPasswordResetEmail: (email: string, resetLink: string) => Promise<void>
}

interface CallUseCaseProps {
  email: string
}

export default function makeRetrievePassword({
  passwordRetrievalRepo,
  credentialsRepo,
  sendPasswordResetEmail,
}: MakeUseCaseProps) {
  return async function retrievePassword({
    email,
  }: CallUseCaseProps): Promise<void> {
    // Check if credentials exist
    const credentials = await credentialsRepo.findByEmail(email)

    if (credentials.is_none()) {
      console.log(
        'Forgotten password request for ' +
          email +
          ' but no account under this email.'
      )
      return
    }

    const passwordRetrievalResult = makePasswordRetrieval({
      email,
      createdOn: Date.now(),
    })

    if (passwordRetrievalResult.is_err()) {
      console.log(
        'retrievePassword use-case failed to make passwordRetrievel entity',
        passwordRetrievalResult.unwrap_err()
      )
      return
    }

    const passwordRetrieval = passwordRetrievalResult.unwrap()

    const insertionResult = await passwordRetrievalRepo.insert(
      passwordRetrieval
    )

    if (insertionResult.is_err()) {
      console.log(
        'retrievePassword use-case failed to insert passwordRetrievel into db',
        insertionResult.unwrap_err()
      )
      return
    }

    // Send email
    await sendPasswordResetEmail(
      email,
      routes.RESET_PASSWORD_LINK({ resetCode: passwordRetrieval.id })
    )
  }
}
