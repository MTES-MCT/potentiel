import { ProjectEventListDTO } from '@modules/frise'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import { Request } from 'express'
import React from 'react'
import { userIs } from '@modules/users'
import { RoleBasedDashboard, SuccessErrorBox, PageLayout, Callout, LinkButton } from '@components'
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
            <CDCInfo {...{ project, cahiersChargesURLs, user }} />
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
  user: Request['user']
}

const CDCInfo = ({ project, cahiersChargesURLs, user }: CDCInfoProps) => (
  <>
    {console.log(project.isClasse, project.appelOffre.choisirNouveauCahierDesCharges)}
    <h3 className="mb-0">Cahier des charges</h3>{' '}
    {project.newRulesOptIn ? (
      cahiersChargesURLs?.newCahierChargesURL ? (
        <div>
          Instruction selon le cahier des charges modifié rétroactivement et publié le 30/07/2021,
          pris en application du décret n° 2019-1175 du 14 novembre 2019 (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={cahiersChargesURLs.newCahierChargesURL}
          >
            voir le cahier des charges <ExternalLinkIcon className="w-4" />
          </a>
          )
          <br />
          {userIs('porteur-projet')(user) &&
            project.isClasse &&
            project.appelOffre.choisirNouveauCahierDesCharges && (
              <LinkButton
                href={`/projet/${project.id}/choisir-cahier-des-charges.html`}
                className="mt-4"
              >
                Changer le cahier des charges
              </LinkButton>
            )}
        </div>
      ) : (
        `Instruction des demandes selon les règles du cahier des charges modifié (option choisie par le candidat)`
      )
    ) : cahiersChargesURLs?.oldCahierChargesURL ? (
      <div>
        Instruction des demandes selon les règles du{' '}
        <a target="_blank" href={cahiersChargesURLs.oldCahierChargesURL} rel="noopener noreferrer">
          cahier des charges initial (en vigueur à la candidature){' '}
          <ExternalLinkIcon className="w-4" />
        </a>
        <br />
        {userIs('porteur-projet')(user) &&
          project.isClasse &&
          project.appelOffre.choisirNouveauCahierDesCharges && (
            <LinkButton
              href={`/projet/${project.id}/choisir-cahier-des-charges.html`}
              className="mt-4"
            >
              Changer de cahier des charges
            </LinkButton>
          )}
      </div>
    ) : (
      `Instruction des demandes selon les règles du cahier des charges initial (en vigueur à la candidature)`
    )}
  </>
)

hydrateOnClient(ProjectDetails)
