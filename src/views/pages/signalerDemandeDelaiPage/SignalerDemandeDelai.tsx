import {
  Button,
  Input,
  SecondaryLinkButton,
  ProjectInfo,
  PageTemplate,
  Astérisque,
  FormulaireChampsObligatoireLégende,
  ErrorBox,
} from '@components'
import { ProjectDataForSignalerDemandeDelaiPage } from '@modules/project'
import routes from '@routes'
import { appliquerDélaiEnMois } from '@views/helpers'
import { Request } from 'express'
import React, { useState } from 'react'
import { formatDate } from '../../../helpers/formatDate'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'

type SignalerDemandeDelaiProps = {
  request: Request
  project: ProjectDataForSignalerDemandeDelaiPage
  validationErrors?: Array<{ [fieldName: string]: string }>
}
export const SignalerDemandeDelai = ({
  request,
  project,
  validationErrors,
}: SignalerDemandeDelaiProps) => {
  const { user } = request
  const { error } = (request.query as any) || {}
  const [doesNewDateImpactProject, newDateImpactsProject] = useState(true)

  const ajoutDélaiCdc2022Possible =
    ['30/08/2022', '30/08/2022-alternatif'].includes(project.cahierDesChargesActuel) &&
    ['admin', 'dgec-validateur'].includes(user.role) &&
    !!project.délaiCDC2022Applicable

  const dateAvecDélaiCDC2022 = project.délaiCDC2022Applicable
    ? appliquerDélaiEnMois({
        dateActuelle: new Date(project.completionDueOn!),
        délaiEnMois: project.délaiCDC2022Applicable,
      })
        .toISOString()
        .split('T')[0]
    : undefined

  const [appliquerCDC2022Délai, setappliquerCDC2022Délai] = useState(false)
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <main role="main" className="panel">
        <div className="panel__header">
          <h1 className="text-2xl">Enregistrer une demande de délai traitée hors Potentiel</h1>
        </div>
        {error && <ErrorBox title={error} />}

        <form
          action={routes.ADMIN_SIGNALER_DEMANDE_DELAI_POST}
          method="POST"
          encType="multipart/form-data"
          className="flex flex-col gap-5"
        >
          <div>
            <FormulaireChampsObligatoireLégende className="text-right" />
            <p className="m-0">Pour le projet</p>
            <ProjectInfo project={project}>
              <p className="m-0">
                {project.completionDueOn ? (
                  <>
                    Date théorique actuelle de mise en service du projet au{' '}
                    <span className="font-bold">{formatDate(project.completionDueOn)}</span>
                  </>
                ) : (
                  <>Ce projet n'a pas de date théorique de mise en service.</>
                )}
              </p>
            </ProjectInfo>
          </div>

          <input name="projectId" value={project.id} readOnly hidden />

          <div>
            <p className="m-0">
              Décision <Astérisque /> :
            </p>
            <div className="flex flex-col lg:flex-row gap-3 my-2">
              <div className="flex flex-row">
                <input
                  type="radio"
                  id="status-accepted"
                  value="acceptée"
                  name="status"
                  onChange={(e) => e.target.checked && newDateImpactsProject(true)}
                  defaultChecked
                  required
                />
                <label htmlFor="status-accepted">Demande acceptée</label>
              </div>
              <div className="flex flex-row">
                <input
                  type="radio"
                  id="status-rejected"
                  value="rejetée"
                  name="status"
                  onChange={(e) => e.target.checked && newDateImpactsProject(false)}
                  required
                  onClick={() => setappliquerCDC2022Délai(false)}
                />
                <label htmlFor="status-rejected">Demande rejetée</label>
              </div>
              <div className="flex flex-row">
                <input
                  type="radio"
                  id="status-accord-principe"
                  value="accord-de-principe"
                  name="status"
                  onChange={(e) => e.target.checked && newDateImpactsProject(false)}
                  required
                  onClick={() => setappliquerCDC2022Délai(false)}
                />
                <label htmlFor="status-accord-principe">Accord de principe</label>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="decidedOn">
              Date de la décision (=date du courrier) <Astérisque />
            </label>
            <Input
              type="date"
              name="decidedOn"
              id="decidedOn"
              required
              {...(validationErrors && { error: validationErrors['decidedOn']?.toString() })}
            />
          </div>

          {doesNewDateImpactProject && (
            <div>
              {ajoutDélaiCdc2022Possible && (
                <label htmlFor="délaiCdc2022" className="mt-4 mb-2">
                  <input
                    type="checkbox"
                    name="délaiCdc2022"
                    value={appliquerCDC2022Délai ? 'true' : 'false'}
                    id="délaiCdc2022"
                    onChange={() => setappliquerCDC2022Délai(!appliquerCDC2022Délai)}
                  />
                  Appliquer le délai de {project.délaiCDC2022Applicable} mois relatif au CDC du
                  30/08/2022.
                </label>
              )}
              <label htmlFor="newCompletionDueOn">
                Nouvelle date d'achèvement accordée <Astérisque />
              </label>
              <Input
                type="date"
                name="newCompletionDueOn"
                id="newCompletionDueOn"
                required
                {...(validationErrors && {
                  error: validationErrors['newCompletionDueOn']?.toString(),
                })}
                defaultValue={appliquerCDC2022Délai ? dateAvecDélaiCDC2022 : undefined}
              />
              <p className="m-0 italic">
                Cette date impactera le projet seulement si elle est postérieure à la date théorique
                de mise en service actuelle.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="file">Courrier de la réponse (fichier joint)</label>
            <input name="file" type="file" className="rounded-none" id="file" />
          </div>

          <div>
            <label htmlFor="notes">Notes</label>
            <textarea
              className="bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid border-gray-600 rounded-none"
              name="notes"
              id="notes"
            ></textarea>
          </div>

          <div className="m-auto flex gap-4">
            <Button type="submit">Enregistrer</Button>
            <SecondaryLinkButton href={routes.PROJECT_DETAILS(project.id)}>
              Annuler
            </SecondaryLinkButton>
          </div>
        </form>
      </main>
    </PageTemplate>
  )
}

hydrateOnClient(SignalerDemandeDelai)
