import React from 'react'
import { User } from '@entities'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import ProjectActions from '../../../components/ProjectActions'
import { ProjectStatusLabel } from 'src/views/components/ProjectStatusLabel'

import { PaperClipIcon } from '@heroicons/react/outline'

interface ProjectHeaderProps {
  project: ProjectDataForProjectPage
  user: User
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const ProjectHeader = ({ project, user, cahiersChargesURLs }: ProjectHeaderProps) => (
  <div className="w-full lg:flex justify-between">
    <div className="">
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
    <div className="ml-auto flex items-center mt-2 lg:mt-0">
      <button type="button" className="button-outline primary mr-3">
        Faire une demande
      </button>
      <button type="button" className="button pl-1" style={{ margin: 0 }}>
        <PaperClipIcon className="h-5 w-5 align-middle mr-2" />
        Attestation
      </button>
    </div>
  </div>
)
