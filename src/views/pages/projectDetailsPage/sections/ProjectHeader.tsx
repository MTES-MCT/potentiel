import React from 'react'
import { User } from '@entities'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import NewProjectActions from '../../projectDetailsPage/components/ProjectActions'
import { ProjectStatusLabel } from 'src/views/components/ProjectStatusLabel'

import { PaperClipIcon } from '@heroicons/react/outline'
import ProjectActions from '../../../components/ProjectActions'

interface ProjectHeaderProps {
  project: ProjectDataForProjectPage
  user: User
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const ProjectHeader = ({ project, user, cahiersChargesURLs }: ProjectHeaderProps) => (
  <div className="w-full lg:flex justify-between gap-2">
    <div className="pl-3 mb-3">
      <div className="flex justify-start items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-0 pb-0">{project.nomProjet}</h1>
        <ProjectStatusLabel
          status={
            !project.notifiedOn
              ? 'non-notifié'
              : project.isAbandoned
              ? 'abandonné'
              : project.isClasse
              ? 'lauréat'
              : 'éliminé'
          }
        />
      </div>
      <p className="text-sm font-medium text-gray-500 p-0 m-0">
        {project.communeProjet}, {project.departementProjet}, {project.regionProjet}
      </p>
      <div style={{ fontSize: 13 }}>{project.potentielIdentifier}</div>
    </div>
    <NewProjectActions project={project} role={user.role} />
  </div>
)
