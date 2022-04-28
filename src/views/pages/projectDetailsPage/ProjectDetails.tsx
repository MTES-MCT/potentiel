import { ProjectEventListDTO } from '@modules/frise'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import { Request } from 'express'
import React from 'react'
import { userIs } from '@modules/users'
import { RoleBasedDashboard, SuccessErrorBox, PageLayout } from '../../components'
import { hydrateOnClient } from '../../helpers'
import {
  EtapesProjet,
  CDCForm,
  EditProjectData,
  InfoGenerales,
  Contact,
  MaterielsEtTechnologies,
  ResultatsAppelOffre,
} from './sections'
import { ProjectHeader } from './components'

type ProjectDetailsProps = {
  request: Request
  project: ProjectDataForProjectPage
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
  projectEventList: ProjectEventListDTO
  now: number
}

export const ProjectDetails = PageLayout(
  ({ request, project, cahiersChargesURLs, projectEventList, now }: ProjectDetailsProps) => {
    const { user } = request
    const { error, success } = (request.query as any) || {}

    return (
      <RoleBasedDashboard role={user.role} currentPage="list-projects">
        <ProjectHeader {...{ project, user, cahiersChargesURLs }} />
        <SuccessErrorBox success={success} error={error} />

        <main className="flex flex-col gap-3 mt-5">
          <div className="flex flex-col lg:flex-row gap-3">
            <EtapesProjet {...{ project, user, projectEventList, now }} />

            <div className="flex flex-col gap-3">
              <InfoGenerales {...{ project }} />
              <Contact {...{ user, project }} />
              <MaterielsEtTechnologies {...{ project }} />

              {project.appelOffre?.type === 'innovation' && userIs('dreal')(user) && (
                <ResultatsAppelOffre {...{ project }} />
              )}
            </div>
          </div>

          {userIs('porteur-projet')(user) &&
            project.isClasse &&
            project.appelOffre.type !== 'eolien' && (
              <CDCForm {...{ project, cahiersChargesURLs }} />
            )}

          {userIs(['admin', 'dgec'])(user) && project.notifiedOn && (
            <EditProjectData project={project} request={request} />
          )}
        </main>
      </RoleBasedDashboard>
    )
  }
)

hydrateOnClient(ProjectDetails)
