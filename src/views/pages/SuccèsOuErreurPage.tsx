import { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import { LinkButton, PageTemplate, RoleBasedDashboard } from '@components'

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
      {success && (
        <pre className="notification success" {...dataId('success-message')}>
          {success}
        </pre>
      )}

      {error && (
        <pre className="notification error" {...dataId('error-message')}>
          {error}
        </pre>
      )}
      <LinkButton href={redirectUrl}> {redirectTitle}</LinkButton>
    </div>
  )

  return (
    <PageTemplate user={request.user}>
      <RoleBasedDashboard role={request.user.role} currentPage={undefined}>
        {contents}
      </RoleBasedDashboard>
    </PageTemplate>
  )
}
