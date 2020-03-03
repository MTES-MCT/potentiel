import * as React from 'react'

import UploadProjects from '../components/uploadProjects'

interface AdminDashboardProps {
  adminName: string
  error?: string
  success?: string
}

/* Pure component */
export default function LoginPage({
  adminName,
  error,
  success
}: AdminDashboardProps) {
  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <UploadProjects error={error} success={success} />
        </div>
      </section>
    </main>
  )
}
