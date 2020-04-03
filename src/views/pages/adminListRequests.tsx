import React from 'react'

import { ModificationRequest, Project, User } from '../../entities'
import ROUTES from '../../routes'

import RequestList from '../components/requestList'
import AdminDashboard from '../components/adminDashboard'
import { HttpRequest } from '../../types'
import { dataId } from '../../helpers/testId'

interface AdminListRequestsProps {
  request: HttpRequest
  modificationRequests?: Array<ModificationRequest>
}

/* Pure component */
export default function UserListRequests({
  request,
  modificationRequests
}: AdminListRequestsProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard currentPage="list-requests">
      <div className="panel">
        <div className="panel__header">
          <h3>Demandes</h3>
          <input
            type="text"
            className="table__filter"
            placeholder="Filtrer les demandes"
          />
        </div>
        {success ? (
          <div className="notification success" {...dataId('success-message')}>
            {success}
          </div>
        ) : (
          ''
        )}
        {error ? (
          <div className="notification error" {...dataId('error-message')}>
            {error}
          </div>
        ) : (
          ''
        )}
        <RequestList modificationRequests={modificationRequests} />
      </div>
    </AdminDashboard>
  )
}
