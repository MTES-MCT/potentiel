import React from 'react'

import AdminDashboard from './adminDashboard'

export default { title: 'Admin Dashboard' }

export const empty = () => <AdminDashboard adminName="Roger Rabbit" />

export const withError = () => (
  <AdminDashboard adminName="Roger Rabbit" error="This is an error message!" />
)

export const withSuccess = () => (
  <AdminDashboard
    adminName="Roger Rabbit"
    success="This is a success message!"
  />
)

export const withProjects = () => (
  <AdminDashboard adminName="Roger Rabbit" projects={projects} />
)
