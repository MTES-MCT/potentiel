import { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import AdminDashboard from '../components/adminDashboard'
import UserDashboard from '../components/userDashboard'

interface SuccessOrErrorProps {
  request: Request
}

/* Pure component */
export default function SuccessOrError({ request }: SuccessOrErrorProps) {
  const { success, redirectUrl, redirectTitle } = request.query || {}

  const contents = (
    <div className="panel">
      <div className="notification success" {...dataId('success-message')}>
        {success}
      </div>
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
