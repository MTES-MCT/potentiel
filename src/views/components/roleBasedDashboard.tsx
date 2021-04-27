import * as React from 'react'
import { User } from '../../entities'
import AdminDashboard from './adminDashboard'
import PartnerDashboard from './partnerDashboard'
import UserDashboard from './userDashboard'

type RoleBasedDashboardProps = {
  children: React.ReactNode
  role: User['role']
  currentPage: Parameters<
    typeof AdminDashboard | typeof UserDashboard | typeof PartnerDashboard
  >[0]['currentPage']
}

export const RoleBasedDashboard = ({ role, children, currentPage }: RoleBasedDashboardProps) => {
  if (['admin', 'dgec', 'dreal'].includes(role)) {
    return (
      <AdminDashboard currentPage={currentPage} role={role}>
        {children}
      </AdminDashboard>
    )
  }

  if (role === 'porteur-projet') {
    // @ts-ignore
    return <UserDashboard currentPage={currentPage}>{children}</UserDashboard>
  }

  if (['acheteur-obligé', 'ademe'].includes(role)) {
    return (
      // @ts-ignore
      <PartnerDashboard currentPage={currentPage} role={role}>
        {children}
      </PartnerDashboard>
    )
  }

  return <div>Role non reconnu</div>
}
