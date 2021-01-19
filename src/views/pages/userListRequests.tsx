import React from 'react'
import { dataId } from '../../helpers/testId'
import { ModificationRequestListItemDTO } from '../../modules/modificationRequest'
import { HttpRequest, PaginatedList } from '../../types'
import RequestList from '../components/requestList'
import UserDashboard from '../components/userDashboard'

interface UserListRequestsProps {
  request: HttpRequest
  modificationRequests?: PaginatedList<ModificationRequestListItemDTO>
}

/* Pure component */
export default function UserListRequests({ request, modificationRequests }: UserListRequestsProps) {
  const { error, success } = request.query || {}
  return (
    <UserDashboard currentPage="list-requests">
      <div className="panel">
        <div className="panel__header">
          <h3>Mes demandes</h3>
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
        <RequestList modificationRequests={modificationRequests} />
      </div>
    </UserDashboard>
  )
}
