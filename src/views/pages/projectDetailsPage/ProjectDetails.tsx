import { ProjectEventListDTO } from '@modules/frise'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import { Request } from 'express'
import React from 'react'
import { userIs } from '@modules/users'
import { SuccessErrorBox, Callout, Link, ExternalLink, PageTemplate, SuccessBox } from '@components'
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
  projectEventList?: ProjectEventListDTO
  now: number
}

export const ProjectDetails = ({
  request,
  project,
  projectEventList,
  now,
}: ProjectDetailsProps) => {
  const { user } = request
  const { error, success } = (request.query as any) || {}
  return (
    <PageTemplate user={request.user} currentPage="list-projects">
      <ProjectHeader {...{ project, user }} />
      {success && <SuccessBox title={success} />}
      {error && <SuccessErrorBox error={error} success={success} />}

      <main className="flex flex-col gap-3 mt-5">
        <Callout>
          <CDCInfo {...{ project, user }} />
        </Callout>
        <div className="flex flex-col lg:flex-row gap-3">
          {projectEventList && <EtapesProjet {...{ project, user, projectEventList, now }} />}
          <div
            className={`flex flex-col ${!projectEventList ? 'xl:flex-row' : ''} gap-3 flex-grow`}
          >
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
    </PageTemplate>
  )
}

type CDCInfoProps = {
  project: ProjectDataForProjectPage
  user: Request['user']
}

const CDCInfo = ({ project: { id: projectId, cahierDesChargesActuel }, user }: CDCInfoProps) => (
  <>
    <h3 className="mb-0">Cahier des charges</h3>{' '}
    <div>
      Instruction selon le cahier des charges{' '}
      {cahierDesChargesActuel.type === 'initial'
        ? 'initial (en vigueur à la candidature)'
        : `${
            cahierDesChargesActuel.alternatif ? 'alternatif' : ''
          } modifié rétroactivement et publié le ${cahierDesChargesActuel.paruLe}`}{' '}
      (<ExternalLink href={cahierDesChargesActuel.url}>voir le cahier des charges</ExternalLink>)
      <br />
      {userIs('porteur-projet')(user) && (
        <Link className="flex mt-4" href={`/projet/${projectId}/choisir-cahier-des-charges.html`}>
          Accéder au choix du cahier des charges
        </Link>
      )}
    </div>
  </>
)

hydrateOnClient(ProjectDetails)
