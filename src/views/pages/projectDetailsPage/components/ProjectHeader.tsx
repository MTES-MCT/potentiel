import React from 'react'
import { User } from '@entities'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import { ProjectStatusLabel, Link } from '@components'
import { ProjectActions } from './ProjectActions'
import { ExternalLinkIcon } from '@heroicons/react/solid'

type ProjectHeaderProps = {
  project: ProjectDataForProjectPage
  user: User
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const ProjectHeader = ({ project, user, cahiersChargesURLs }: ProjectHeaderProps) => (
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

      <CDCInfo {...{ project, cahiersChargesURLs }} />
    </div>

    <div className="px-3">
      <ProjectActions {...{ project, user }} />
    </div>
  </div>
)

type CDCInfoProps = {
  project: ProjectDataForProjectPage
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}
const CDCInfo = ({ project, cahiersChargesURLs }: CDCInfoProps) => (
  <div className="text-sm">
    Instruction des demandes selon les règles du{' '}
    {project.newRulesOptIn ? (
      cahiersChargesURLs?.newCahierChargesURL ? (
        <div>
          <a target="_blank" href={cahiersChargesURLs.newCahierChargesURL}>
            cahier des charges modifié (option choisie par le candidat){' '}
            <ExternalLinkIcon className="w-4" />
          </a>
          <br />
          <Link href={`/projet/${project.id}/choisir-cahier-des-charges.html`}>
            Choisir le cahier des charges
          </Link>
        </div>
      ) : (
        `cahier des charges modifié (option choisie par le candidat)`
      )
    ) : cahiersChargesURLs?.oldCahierChargesURL ? (
      <div>
        <a target="_blank" href={cahiersChargesURLs.oldCahierChargesURL}>
          cahier des charges initial (en vigueur à la candidature){' '}
          <ExternalLinkIcon className="w-4" />
        </a>
        <br />
        <Link href={`/projet/${project.id}/choisir-cahier-des-charges.html`}>
          Choisir le cahier des charges
        </Link>
      </div>
    ) : (
      `cahier des charges initial (en vigueur à la candidature)`
    )}
  </div>
)
