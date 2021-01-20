import React from 'react'
import { dataId } from '../../helpers/testId'
import { ModificationRequestListItemDTO } from '../../modules/modificationRequest'
import { HttpRequest, PaginatedList } from '../../types'
import AdminDashboard from '../components/adminDashboard'
import RequestList from '../components/requestList'
import UserDashboard from '../components/userDashboard'

interface ModificationRequestListProps {
  request: HttpRequest
  modificationRequests?: PaginatedList<ModificationRequestListItemDTO>
}

/* Pure component */
export default function ModificationRequestList({
  request,
  modificationRequests,
}: ModificationRequestListProps) {
  const { error, success } = request.query || {}
  const Dashboard = request.user?.role === 'porteur-projet' ? UserDashboard : AdminDashboard
  return (
    <Dashboard role={request.user?.role} currentPage="list-requests">
      <div className="panel">
        <div className="panel__header">
          <h3>Demandes</h3>
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
    </Dashboard>
  )
}
