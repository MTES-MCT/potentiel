import * as React from 'react'
import { UserRole } from '@modules/users'
import { AdminDashboard } from '@components'

type RoleBasedDashboardProps = {
  children: React.ReactNode
  role: UserRole
  currentPage: Parameters<typeof AdminDashboard>[0]['currentPage']
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

  return <>{children}</>
}
