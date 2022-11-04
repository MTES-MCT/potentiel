import { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import { LinkButton, PageTemplate, SuccessBox } from '@components'
import { hydrateOnClient } from '../helpers'

interface SuccèsOuErreurProps {
  request: Request
}

export const SuccèsOuErreur = ({ request }: SuccèsOuErreurProps) => {
  const {
    success,
    error,
    redirectUrl,
    redirectTitle,
  }: {
    success?: string
    error?: string
    redirectUrl: string
    redirectTitle: string
  } = (request.query as any) || {}

  const contents = (
    <div className="panel">
      {success && <SuccessBox title={success} className="mb-4" />}

      {error && (
        <pre className="notification error" {...dataId('error-message')}>
          {error}
        </pre>
      )}
      <LinkButton href={redirectUrl}> {redirectTitle}</LinkButton>
    </div>
  )

  return <PageTemplate user={request.user}>{contents}</PageTemplate>
}

hydrateOnClient(SuccèsOuErreur)
