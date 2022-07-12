import { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import { AdminDashboard, UserDashboard } from "@components"

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

      <a className="button" href={redirectUrl}>
        {redirectTitle}
      </a>
    </div>
  )

  if (request.user?.role === 'porteur-projet') {
    return <UserDashboard currentPage={undefined}>{contents}</UserDashboard>
  }

  return (
    <AdminDashboard role={request.user?.role} currentPage={undefined}>
      {contents}
    </AdminDashboard>
  )
}
