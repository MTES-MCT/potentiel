import * as React from 'react'
import { UserRole } from '@modules/users'
import { AdminDashboard, PartnerDashboard, UserDashboard } from '@components'

type RoleBasedDashboardProps = {
  children: React.ReactNode
  role: UserRole
  currentPage: Parameters<
    typeof AdminDashboard | typeof UserDashboard | typeof PartnerDashboard
  >[0]['currentPage']
}

export const RoleBasedDashboard = ({ role, children, currentPage }: RoleBasedDashboardProps) => {
  if (['admin', 'dgec-validateur', 'dreal'].includes(role)) {
    return (
      // @ts-ignore
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
