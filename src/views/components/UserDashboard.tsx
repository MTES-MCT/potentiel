import React from 'react'

interface UserDashboardProps {
  children: React.ReactNode
  currentPage?: 'list-projects' | 'list-requests' | 'list-missing-owner-projects'
}

/* Pure component */
export function UserDashboard({ children, currentPage }: UserDashboardProps) {
  return <>{children}</>
}
