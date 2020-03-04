import React from 'react'

import { Project } from '../../entities'
import UploadProjects from '../components/uploadProjects'
import ProjectList from '../components/projectList'

interface AdminDashboardProps {
  adminName: string
  error?: string
  success?: string
  projects?: Array<Project>
}

/* Pure component */
export default function LoginPage({
  adminName,
  error,
  success,
  projects
}: AdminDashboardProps) {
  return (
    <>
      <div className="hero" role="banner">
        <div className="hero__container" style={{ minHeight: '10em' }}>
          <h1>Administrateur DGEC</h1>
        </div>
      </div>
      <main role="main">
        <section className="section section-grey">
          <div className="container">
            <UploadProjects error={error} success={success} />
          </div>
        </section>
        <section className="section section-white">
          <div className="container">
            <ProjectList projects={projects} />
          </div>
        </section>
      </main>
    </>
  )
}
