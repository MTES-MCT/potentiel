import { Request } from 'express'
import React from 'react'
import { LinkButton, PageTemplate, SuccessBox, ErrorBox } from '@components'
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
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}
      <LinkButton href={redirectUrl}> {redirectTitle}</LinkButton>
    </div>
  )

  return <PageTemplate user={request.user}>{contents}</PageTemplate>
}

hydrateOnClient(SuccèsOuErreur)
