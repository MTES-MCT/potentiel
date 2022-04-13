import React, { useState } from 'react'
import { Request } from 'express'
import { PageLayout, RoleBasedDashboard } from '@views/components'
import routes from '../../../routes'
import { ProjectDataForSignalerDemandeDelaiPage } from '@modules/project'
import { Button } from 'src/views/components/buttons/Button'
import { ProjectInfo } from 'src/views/components/ProjectInfo'

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
          <p>
            Le projet {project.nomProjet} a actuellement une date d'attestation de conformité prévue
            le {new Intl.DateTimeFormat('fr').format(project.completionDueOn)} (la date la plus
            récente sera prise en compte pour le projet).
          </p>

          <form
            action={routes.ADMIN_SIGNALER_DEMANDE_DELAI_POST}
            method="POST"
            className="flex flex-col gap-5"
          >
            <div>
              <p className="m-0">Pour le projet</p>
              <ProjectInfo project={project} />
            </div>

            <input name="projectId" value={project.id} required hidden />

            <div>
              <label>Date de la décision*</label>
              <input type="date" name="decidedOn" required />
            </div>

            <div className="flex flex-row gap-3 my-2">
              <p className="m-0">Demande : </p>
              <div className="flex">
                <input
                  type="radio"
                  id="status-accepted"
                  name="isAccepted"
                  onChange={(e) => e.target.checked && setIsAccepted(true)}
                  {...(isAccepted && { checked: true })}
                  required
                />
                <label htmlFor="status-accepted">Acceptée</label>
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
                <label htmlFor="status-rejected">Refusée</label>
              </div>
            </div>

            <div>
              <label>Nouvelle date d'attestation de conformité*</label>
              <input type="date" name="newCompletionDueOn" />
            </div>

            <div>
              <label>Courrier de la réponse (fichier joint)</label>
              <input name="answerFile" type="file" />
            </div>

            <div>
              <label>Notes</label>
              <textarea name="notes"></textarea>
            </div>

            <Button type="submit" primary={true} className="inline-block m-auto">
              Enregistrer
            </Button>
          </form>
        </main>
      </RoleBasedDashboard>
    )
  }
)
