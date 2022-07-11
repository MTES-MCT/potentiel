import { PageLayout, RoleBasedDashboard } from '@components'
import { Request } from 'express'
import React from 'react'

type DemanderDélaiProps = {
  request: Request
}

export const DemanderDélai = PageLayout(({ request: { user } }: DemanderDélaiProps) => {
  return (
    <RoleBasedDashboard role={user.role} currentPage="list-projects">
      <h1>DemanderDélai</h1>
    </RoleBasedDashboard>
  )
})
