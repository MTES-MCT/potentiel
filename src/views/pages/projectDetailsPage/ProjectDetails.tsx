import { ProjectEventListDTO } from '@modules/frise'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import { Request } from 'express'
import React from 'react'
import { userIs } from '@modules/users'
import {
  RoleBasedDashboard,
  SuccessErrorBox,
  PageLayout,
  Callout,
  LinkButton,
  ExternalLink,
} from '@components'
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

type ProjectDetailsProps = {
  request: Request
  project: ProjectDataForProjectPage
  projectEventList: ProjectEventListDTO
  now: number
}

export const ProjectDetails = PageLayout(
  ({ request, project, projectEventList, now }: ProjectDetailsProps) => {
    const { user } = request
    const { error, success } = (request.query as any) || {}
    return (
      <RoleBasedDashboard role={user.role} currentPage="list-projects">
        <ProjectHeader {...{ project, user }} />
        <SuccessErrorBox success={success} error={error} />

        <main className="flex flex-col gap-3 mt-5">
          <Callout>
            <CDCInfo {...{ project, user }} />
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
  user: Request['user']
}

const CDCInfo = ({
  project: { id: projectId, appelOffre, isClasse, nouvellesRèglesDInstructionChoisies },
  user,
}: CDCInfoProps) => {
  const nouveauCahierDesCharges = appelOffre.cahiersDesChargesModifiésDisponibles.find(
    (cdc) => cdc.paruLe === '30/07/2021'
  )

  return (
    <>
      <h3 className="mb-0">Cahier des charges</h3>{' '}
      {nouvellesRèglesDInstructionChoisies ? (
        nouveauCahierDesCharges ? (
          <div>
            Instruction selon le cahier des charges modifié rétroactivement et publié le 30/07/2021,
            pris en application du décret n° 2019-1175 du 14 novembre 2019 (
            <ExternalLink href={nouveauCahierDesCharges.url}>
              voir le cahier des charges
            </ExternalLink>
            )
            <br />
            {userIs('porteur-projet')(user) &&
              isClasse &&
              appelOffre.choisirNouveauCahierDesCharges && (
                <LinkButton
                  href={`/projet/${projectId}/choisir-cahier-des-charges.html`}
                  className="mt-4"
                >
                  Changer le cahier des charges
                </LinkButton>
              )}
          </div>
        ) : (
          `Instruction des demandes selon les règles du cahier des charges modifié (option choisie par le candidat)`
        )
      ) : (
        <div>
          Instruction des demandes selon les règles du{' '}
          <ExternalLink href={appelOffre.periode.cahierDesCharges.url}>
            cahier des charges initial (en vigueur à la candidature)
          </ExternalLink>
          <br />
          {userIs('porteur-projet')(user) && isClasse && appelOffre.choisirNouveauCahierDesCharges && (
            <LinkButton
              href={`/projet/${projectId}/choisir-cahier-des-charges.html`}
              className="mt-4"
            >
              Changer de cahier des charges
            </LinkButton>
          )}
        </div>
      )}
    </>
  )
}

hydrateOnClient(ProjectDetails)
