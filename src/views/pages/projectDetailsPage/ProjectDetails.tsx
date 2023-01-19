import { ProjectEventListDTO } from '@modules/frise'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import { Request } from 'express'
import React from 'react'
import { userIs } from '@modules/users'
import {
  Callout,
  Link,
  ExternalLink,
  PageTemplate,
  SuccessBox,
  ErrorBox,
  AlertBox,
  Button,
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
import routes from '@routes'

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
      {error && <ErrorBox title={error} />}
      <main className="flex flex-col gap-3 mt-5">
        {project.afficherAlerteAnnulationAbandon && userIs('porteur-projet')(user) && (
          <AlerteAnnulationAbandonPossible {...{ ...project }} />
        )}
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

const AlerteAnnulationAbandonPossible = ({
  id: projetId,
  afficherBoutonAnnulerAbandon,
}: {
  id: ProjectDataForProjectPage['id']
  afficherBoutonAnnulerAbandon?: ProjectDataForProjectPage['afficherBoutonAnnulerAbandon']
}) => (
  <AlertBox title="Annulation abandon">
    <p className="m-0">
      Vous avez la possibilité d'annuler l'abandon de votre projet avant le 3 février 2023.
    </p>
    {afficherBoutonAnnulerAbandon ? (
      <>
        <form method="post" action={routes.POST_DEMANDER_ANNULATION_ABANDON} className="m-0 p-0">
          <input type="hidden" name="projetId" value={projetId} />
          <Button
            type="submit"
            onClick={(event) =>
              confirm(
                `Confirmez-vous la création d'une demande d'annulation d'abandon du projet ?`
              ) || event.preventDefault()
            }
            className="mt-4"
          >
            Demander l'annulation de l'abandon
          </Button>
        </form>
      </>
    ) : (
      <p className="m-0">
        Pour cela vous devez d'abord choisir le dernier cahier des charges modifié publié (voir
        encart ci-dessous).
      </p>
    )}
  </AlertBox>
)

hydrateOnClient(ProjectDetails)
