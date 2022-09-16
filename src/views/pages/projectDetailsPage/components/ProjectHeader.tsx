import React from 'react'
import { User } from '@entities'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import { ProjectStatusLabel } from '@components'
import { ProjectActions } from './ProjectActions'

type ProjectHeaderProps = {
  project: ProjectDataForProjectPage
  user: User
}

export const ProjectHeader = ({ project, user }: ProjectHeaderProps) => (
  <div className="w-full pt-3 md:pt-0 lg:flex justify-between gap-2">
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
      <div className="text-sm">{project.potentielIdentifier}</div>
    </div>

    <div className="px-3">
      <ProjectActions {...{ project, user }} />
    </div>
  </div>
)
