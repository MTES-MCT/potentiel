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
  <div className="max-w-3xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl">
    <div className="flex items-center space-x-5">
      <div>
        <div className="flex items-center">
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
        <div style={{ fontSize: 13 }}>
          {project.potentielIdentifier}{' '}
          {cahiersChargesURLs && (
            <>
              {'('}
              {cahiersChargesURLs.oldCahierChargesURL && (
                <a href={cahiersChargesURLs.oldCahierChargesURL}>ancien cahier des charges</a>
              )}

              {cahiersChargesURLs.newCahierChargesURL && (
                <>
                  {' | '}
                  <a href={cahiersChargesURLs.newCahierChargesURL}>nouveau cahier des charges</a>
                </>
              )}
              {')'}
            </>
          )}
        </div>
        <div style={{ fontSize: 13 }}>
          Instruction des demandes selon {project.newRulesOptIn ? 'les nouvelles' : 'les anciennes'}{' '}
          règles
        </div>
      </div>
    </div>
    <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
      <button
        type="button"
        className="inline-flex items-center justify-center button-outline primary"
      >
        Faire une demande
      </button>
      <button type="button" className="inline-flex items-center justify-center button pl-1">
        <PaperClipIcon className="h-5 w-5 align-middle mr-2" />
        Attestation
      </button>
    </div>
  </div>
)
