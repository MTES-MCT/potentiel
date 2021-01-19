import React from 'react'
import { dataId } from '../../helpers/testId'
import { ModificationRequestListItemDTO } from '../../modules/modificationRequest'
import { HttpRequest, PaginatedList } from '../../types'
import AdminDashboard from '../components/adminDashboard'
import RequestList from '../components/requestList'

interface AdminListRequestsProps {
  request: HttpRequest
  modificationRequests?: PaginatedList<ModificationRequestListItemDTO>
}

/* Pure component */
export default function UserListRequests({
  request,
  modificationRequests,
}: AdminListRequestsProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard role={request.user?.role} currentPage="list-requests">
      <div className="panel">
        <div className="panel__header">
          <h3>Demandes</h3>
          {/* <input
            type="text"
            className="table__filter"
            placeholder="Filtrer les demandes"
          /> */}
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
        <RequestList modificationRequests={modificationRequests} role={request.user?.role} />
      </div>
    </AdminDashboard>
  )
}
