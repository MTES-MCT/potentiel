import { ProjectEventListDTO } from '@modules/frise'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import { Request } from 'express'
import React from 'react'
import { userIs } from '@modules/users'
import { RoleBasedDashboard, SuccessErrorBox, PageLayout, Callout, Link } from '@components'
import { hydrateOnClient } from '../../helpers'
import {
  EtapesProjet,
  EditProjectData,
  InfoGenerales,
  Contact,
  MaterielsEtTechnologies,
  ResultatsAppelOffre,
  ContratEDF,
  ContratEnedis,
} from './sections'
import { ProjectHeader } from './components'
import { ExternalLinkIcon } from '@heroicons/react/solid'

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
          <Callout>
            <CDCInfo {...{ project, cahiersChargesURLs }} />
          </Callout>
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

          {userIs(['admin', 'dgec-validateur'])(user) && project.notifiedOn && (
            <EditProjectData project={project} request={request} />
          )}

          {['admin', 'dgec-validateur'].includes(user.role) && !!project.contratEDF && (
            <ContratEDF contrat={project.contratEDF} />
          )}

          {['admin', 'dgec-validateur'].includes(user.role) && !!project.contratEnedis && (
            <ContratEnedis contrat={project.contratEnedis} />
          )}
        </main>
      </RoleBasedDashboard>
    )
  }
)

type CDCInfoProps = {
  project: ProjectDataForProjectPage
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

const CDCInfo = ({ project, cahiersChargesURLs }: CDCInfoProps) => (
  <>
    <h3 className="section--title">Cahier des charges</h3>
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
  </>
)

hydrateOnClient(ProjectDetails)
