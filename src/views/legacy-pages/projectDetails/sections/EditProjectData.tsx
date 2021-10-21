import { Request } from 'express'
import React from 'react'
import { appelsOffreStatic } from '../../../../dataAccess/inMemory/appelOffre'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import { ProjectDataForProjectPage } from '../../../../modules/project/dtos'
import ROUTES from '../../../../routes'

interface EditProjectDataProps {
  project: ProjectDataForProjectPage
  request: Request
}

export const EditProjectData = ({ project, request }: EditProjectDataProps) => {
  const { query } = request as any

  if (!project.notifiedOn) {
    return <div>Projet non-notifié</div>
  }

  if (project.isAbandoned) {
    return <div>Projet abandonné</div>
  }

  return (
    <div>
      <form
        action={ROUTES.ADMIN_CORRECT_PROJECT_DATA_ACTION}
        method="post"
        encType="multipart/form-data"
      >
        <input type="hidden" name="projectId" value={project.id} />
        <input type="hidden" name="projectVersionDate" value={project.updatedAt?.getTime()} />
        <div className="form__group">
          <label>Période</label>
          <select
            name="appelOffreAndPeriode"
            defaultValue={
              query.appelOffreAndPeriode || `${project.appelOffreId}|${project.periodeId}`
            }
          >
            {appelsOffreStatic.reduce((periodes: React.ReactNode[], appelOffre) => {
              return periodes?.concat(
                appelOffre.periodes.map((periode) => (
                  <option
                    key={`${appelOffre.id}|${periode.id}`}
                    value={`${appelOffre.id}|${periode.id}`}
                  >
                    {appelOffre.id} - {periode.id}
                  </option>
                ))
              )
            }, [] as React.ReactNode[])}
          </select>
        </div>
        <div className="form__group">
          <label>Famille</label>
          <input
            type="text"
            name="familleId"
            defaultValue={query.familleId || project.familleId || ''}
          />
        </div>
        <div className="form__group">
          <label>Territoire</label>
          <input
            type="text"
            name="territoireProjet"
            defaultValue={query.territoireProjet || project.territoireProjet || ''}
          />
        </div>
        <div className="form__group">
          <label>Numéro CRE</label>
          <input type="text" name="numeroCRE" defaultValue={query.numeroCRE || project.numeroCRE} />
        </div>
        <div className="form__group">
          <label>Nom Projet</label>
          <input type="text" name="nomProjet" defaultValue={query.nomProjet || project.nomProjet} />
        </div>
        <div className="form__group">
          <label>Puissance (en {project.appelOffre?.unitePuissance})</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]+([\.,][0-9]+)?"
            name="puissance"
            defaultValue={query.puissance || project.puissance}
          />
        </div>
        <div className="form__group">
          <label>Prix de référence</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]+([\.,][0-9]+)?"
            name="prixReference"
            defaultValue={query.prixReference || project.prixReference}
          />
        </div>
        <div className="form__group">
          <label>Evaluation carbone</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]+([\.,][0-9]+)?"
            name="evaluationCarbone"
            defaultValue={query.evaluationCarbone || project.evaluationCarbone}
          />
        </div>
        <div className="form__group">
          <label>Note</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]+([\.,][0-9]+)?"
            name="note"
            defaultValue={query.note || project.note}
          />
        </div>
        <div className="form__group">
          <label>Nom candidat</label>
          <input
            type="text"
            name="nomCandidat"
            defaultValue={query.nomCandidat || project.nomCandidat}
          />
        </div>
        <div className="form__group">
          <label>Nom représentant légal</label>
          <input
            type="text"
            name="nomRepresentantLegal"
            defaultValue={query.nomRepresentantLegal || project.nomRepresentantLegal}
          />
        </div>
        <div className="form__group">
          <label>Email</label>
          <input type="email" name="email" defaultValue={query.email || project.email} />
        </div>
        <div className="form__group">
          <label>Adresse projet (rue et numéro)</label>
          <input
            type="text"
            name="adresseProjet"
            defaultValue={query.adresseProjet || project.adresseProjet}
          />
        </div>
        <div className="form__group">
          <label>Code postal projet</label>
          <input
            type="text"
            name="codePostalProjet"
            defaultValue={query.codePostalProjet || project.codePostalProjet}
          />
        </div>
        <div className="form__group">
          <label>Commune</label>
          <input
            type="text"
            name="communeProjet"
            defaultValue={query.communeProjet || project.communeProjet}
          />
        </div>
        <div className="form__group">
          <label>Engagement de fourniture de puissance à la pointe</label>
          <input
            type="checkbox"
            name="engagementFournitureDePuissanceAlaPointe"
            defaultChecked={
              query.engagementFournitureDePuissanceAlaPointe ||
              project.engagementFournitureDePuissanceAlaPointe
            }
          />
        </div>
        <div className="form__group">
          <label>Financement/Investissement participatif</label>
          <select
            name="participatif"
            defaultValue={
              query.participatif ||
              (project.isFinancementParticipatif
                ? 'financement'
                : project.isInvestissementParticipatif
                ? 'investissement'
                : '')
            }
          >
            <option value={''}>Non</option>
            <option value={'financement'}>Financement participatif</option>
            <option value={'investissement'}>Investissement participatif</option>
          </select>
        </div>
        {!project.isClasse ? (
          <>
            <div className="form__group">
              <label>Classement</label>
              <select name="isClasse" defaultValue={0}>
                <option value={1}>Classé</option>
                <option value={0}>Eliminé</option>
              </select>
            </div>
            <div className="form__group">
              <label>Motif Elimination (si éliminé)</label>
              <input
                type="text"
                name="motifsElimination"
                defaultValue={query.motifsElimination || project.motifsElimination}
              />
            </div>
          </>
        ) : (
          <div className="form__group">
            <label>Classement</label>
            <b>Classé</b>
          </div>
        )}

        {!project.isLegacy && (
          <div className="form__group">
            <label htmlFor="notificationDate">Date désignation (format JJ/MM/AAAA)</label>
            <input
              type="text"
              name="notificationDate"
              id="notificationDate"
              {...dataId('date-field')}
              defaultValue={
                query.notificationDate ||
                (project.notifiedOn && formatDate(project.notifiedOn, 'DD/MM/YYYY'))
              }
              style={{ width: 'auto' }}
            />
            <div
              className="notification error"
              style={{ display: 'none' }}
              {...dataId('error-message-wrong-format')}
            >
              Le format de la date saisie n’est pas conforme. Elle doit être de la forme JJ/MM/AAAA
              soit par exemple 25/05/2022 pour 25 Mai 2022.
            </div>
          </div>
        )}

        {!project.isLegacy && (
          <div className="form__group">
            <div>
              <input
                type="radio"
                name="attestation"
                id="regenerate"
                value="regenerate"
                defaultChecked
              />
              <label htmlFor="regenerate">
                Regénérer l'attestation (si les données du projet ont changé)
              </label>
            </div>
            <div>
              <input type="radio" name="attestation" id="donotregenerate" value="donotregenerate" />
              <label htmlFor="donotregenerate">Ne pas regénérer l'attestation</label>
            </div>
            <div>
              <input type="radio" name="attestation" id="custom" value="custom" />
              <label htmlFor="custom">Uploader une attestation</label>
              <input type="file" name="file" id="file" />
            </div>
          </div>
        )}
        <div className="form__group">
          <label htmlFor="forceCertificateGeneration">
            Message justificatif du changement (facultatif)
          </label>
          <textarea name="reason" defaultValue={query.reason} />
        </div>
        <button className="button" type="submit" name="submit" {...dataId('submit-button')}>
          Modifier
        </button>
      </form>
    </div>
  )
}
