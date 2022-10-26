import * as React from 'react'
import { UserRole } from '@modules/users'
import { AdminDashboard } from '@components'

type RoleBasedDashboardProps = {
  children: React.ReactNode
  role: UserRole
  currentPage: Parameters<typeof AdminDashboard>[0]['currentPage']
}

export const RoleBasedDashboard = ({ role, children, currentPage }: RoleBasedDashboardProps) => {
  if ([].includes(role)) {
    return (
      <AdminDashboard currentPage={currentPage} role={role}>
        {children}
      </AdminDashboard>
    )
  }

  return <>{children}</>
}
