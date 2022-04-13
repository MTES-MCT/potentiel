import React from 'react'
import { Request } from 'express'
import { PageLayout, RoleBasedDashboard } from '@views/components'
import routes from '../../../routes'
import { ProjectDataForSignalerDemandeDelaiPage } from '@modules/project'
import { formatDate } from '../../../helpers/formatDate'

type SignalerDemandeDelaiProps = {
  request: Request
  project: ProjectDataForSignalerDemandeDelaiPage
}
export const SignalerDemandeDelai = PageLayout(
  ({ request: { user }, project }: SignalerDemandeDelaiProps) => {
    return (
      <RoleBasedDashboard role={user.role} currentPage="list-projects">
        <div className="p-3">
          <h1>Signaler une demande de délai traitée hors Potentiel</h1>

          {project.completionDueOn && (
            <p>
              Le projet {project.nomProjet} a actuellement une date d'attestation de conformité
              prévue le {formatDate(project.completionDueOn)} (la date la plus récente sera prise en
              compte pour le projet).
            </p>
          )}

          <form
            action={routes.ADMIN_SIGNALER_DEMANDE_DELAI_POST}
            method="POST"
            encType="multipart/form-data"
          >
            <input name="projectId" value={project.id} readOnly hidden />

            <label>Date de la décision*</label>
            <input
              name="decidedOn"
              placeholder="JJ/MM/AAAA"
              defaultValue={formatDate(new Date())}
              required
            />

            <div className="flex flex-row gap-3 my-2">
              <div>
                <input
                  type="radio"
                  id="status-accepted"
                  name="isAccepted"
                  defaultChecked
                  required
                />
                <label htmlFor="status-accepted">Acceptée</label>
              </div>
              <div>
                <input type="radio" id="status-rejected" name="isAccepted" required />
                <label htmlFor="status-rejected">Refusée</label>
              </div>
            </div>

            <label>Nouvelle date d'attestation de conformité*</label>
            <input name="newCompletionDueOn" placeholder="JJ/MM/AAAA" />

            <label>Courrier de la réponse (fichier joint)</label>
            <input name="file" type="file" />

            <label>Notes</label>
            <textarea name="notes"></textarea>

            <button className="button primary" type="submit">
              Enregistrer
            </button>
          </form>
        </div>
      </RoleBasedDashboard>
    )
  }
)
