import { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import { LinkButton, RoleBasedDashboard } from '@components'

interface SuccessOrErrorProps {
  request: Request
}

/* Pure component */
export default function SuccessOrError({ request }: SuccessOrErrorProps) {
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
    <RoleBasedDashboard role={request.user.role} currentPage={undefined}>
      {contents}
    </RoleBasedDashboard>
  )
}
