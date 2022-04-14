import React, { useState } from 'react'
import { Request } from 'express'
import { LinkButton, PageLayout, RoleBasedDashboard } from '@views/components'
import routes from '../../../routes'
import { ProjectDataForSignalerDemandeDelaiPage } from '@modules/project'
import { Button } from 'src/views/components/buttons/Button'
import { ProjectInfo } from 'src/views/components/ProjectInfo'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'
import { formatDate } from 'src/helpers/formatDate'

type SignalerDemandeDelaiProps = {
  request: Request
  project: ProjectDataForSignalerDemandeDelaiPage
}
export const SignalerDemandeDelai = PageLayout(
  ({ request: { user }, project }: SignalerDemandeDelaiProps) => {
    const [isAccepted, setIsAccepted] = useState(true)

    return (
      <RoleBasedDashboard role={user.role} currentPage="list-projects">
        <main role="main" className="panel">
          <div className="panel__header">
            <h1 className="text-2xl">Signaler une demande de délai traitée hors Potentiel</h1>
          </div>

          <form
            action={routes.ADMIN_SIGNALER_DEMANDE_DELAI_POST}
            method="POST"
            className="flex flex-col gap-5"
          >
            <div>
              <p className="m-0">Pour le projet</p>
              <ProjectInfo project={project}>
                {project.completionDueOn ? (
                  <p className="m-0">
                    Date théorique actuelle de mise en service du projet au{' '}
                    {formatDate(project.completionDueOn)}
                  </p>
                ) : (
                  <p>Ce projet n'a pas de date théorique de mise en service.</p>
                )}
              </ProjectInfo>
            </div>

            <input name="projectId" value={project.id} readOnly hidden />

            <div className="flex flex-row gap-3 my-2">
              <p className="m-0">Décision : </p>
              <div className="flex">
                <input
                  type="radio"
                  id="status-accepted"
                  name="isAccepted"
                  onChange={(e) => e.target.checked && setIsAccepted(true)}
                  {...(isAccepted && { checked: true })}
                  required
                />
                <label htmlFor="status-accepted">Demande acceptée</label>
              </div>
              <div className="flex">
                <input
                  type="radio"
                  id="status-rejected"
                  name="isAccepted"
                  onChange={(e) => e.target.checked && setIsAccepted(false)}
                  {...(!isAccepted && { checked: true })}
                  required
                />
                <label htmlFor="status-rejected">Demande refusée</label>
              </div>
            </div>

            <div>
              <label>Date de la décision*</label>
              <InputDate name="decidedOn" required />
            </div>

            <div>
              <label>Date de mise en service demandée par le porteur*</label>
              <InputDate name="newCompletionDueOn" required />
              {isAccepted ? (
                <p className="m-0 italic">
                  Cette date impactera le projet seulement si elle est postérieure à la date
                  théorique de mise en service actuelle.
                </p>
              ) : (
                <p className="m-0 italic">
                  Cette information sera indiquée dans l'historique du projet (frise de la page du
                  projet) mais n'aura pas d'impact sur la date de mise en service du projet.
                </p>
              )}
            </div>

            <div>
              <label>Courrier de la réponse (fichier joint)</label>
              <input name="answerFile" type="file" className="rounded-none" />
            </div>

            <div>
              <label>Notes</label>
              <textarea
                className="bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid border-gray-600 rounded-none"
                name="notes"
              ></textarea>
            </div>

            <div className="m-auto flex gap-4">
              <Button type="submit" primary={true}>
                Enregistrer
              </Button>
              <LinkButton href={routes.PROJECT_DETAILS(project.id)}>Annuler</LinkButton>
            </div>
          </form>
        </main>
      </RoleBasedDashboard>
    )
  }
)

hydrateOnClient(SignalerDemandeDelai)

type InputDateProps = {
  name: string
  required?: true
  className?: string
}

const InputDate = ({ name, required, className = '' }: InputDateProps) => (
  <input
    type="date"
    name={name}
    {...(required && { required: true })}
    className={`${className} bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid border-gray-600 rounded-none`}
  />
)
