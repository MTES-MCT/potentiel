import React from 'react'

import { Project, AppelOffre } from '../../entities'
import ROUTES from '../../routes'

import ProjectList from '../components/projectList'
import UserDashboard from '../components/userDashboard'
import { HttpRequest } from '../../types'
import { dataId } from '../../helpers/testId'

import { porteurProjetActions } from '../components/actions'

interface UserListProjectsProps {
  request: HttpRequest
  projects: Array<Project>
}

/* Pure component */
export default function UserListProjects({
  request,
  projects,
}: UserListProjectsProps) {
  const { error, success } = request.query || {}
  return (
    <UserDashboard currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <h3>Mes projets</h3>
          {/* <input
            type="text"
            className="table__filter"
            placeholder="Filtrer les projets"
          /> */}
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
        <ProjectList
          displayColumns={[
            'Periode',
            'Projet',
            'Candidat',
            'Puissance',
            'Prix',
            'Evaluation Carbone',
            'Classé',
          ]}
          projects={projects}
          projectActions={porteurProjetActions}
        />
      </div>
    </UserDashboard>
  )
}
