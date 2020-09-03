import React from 'react'

import { Project } from '../../entities'

import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import UserDashboard from '../components/userDashboard'
import { HttpRequest } from '../../types'

import { formatDate } from '../../helpers/formatDate'

import { appelsOffreStatic } from '../../dataAccess/inMemory'

import moment from 'moment'
moment.locale('fr')

interface PageProps {
  request: HttpRequest
  project: Project
}

const titlePerAction = {
  // fournisseur: 'changement de fournisseur',
  delai: 'délai supplémentaire',
  actionnaire: "changement d'actionnaire",
  puissance: 'changement de puissance',
  producteur: 'changement de producteur',
  abandon: 'abandon de mon projet',
  recours: 'recours',
}

const getunitePuissanceForAppelOffre = (appelOffreId) => {
  return appelsOffreStatic.find((item) => item.id === appelOffreId)
    ?.unitePuissance
}

const getDelayForAppelOffre = (appelOffreId) => {
  return appelsOffreStatic.find((item) => item.id === appelOffreId)
    ?.delaiRealisationEnMois
}

export { titlePerAction }

/* Pure component */
export default function ModificationRequestPage({
  request,
  project,
}: PageProps) {
  const {
    action,
    error,
    success,
    puissance,
    actionnaire,
    producteur,
    fournisseur,
    justification,
    evaluationCarbone,
    delayedServiceDate,
  } = request.query || {}

  // console.log('modificationRequest page with action', action)

  return (
    <UserDashboard currentPage={'list-requests'}>
      <div className="panel">
        <div className="panel__header">
          <h3>Je demande un {titlePerAction[action]}</h3>
        </div>
        <form
          action={ROUTES.DEMANDE_ACTION}
          method="post"
          encType="multipart/form-data"
        >
          <input type="hidden" name="projectId" value={project.id} />
          <input type="hidden" name="type" value={action} />
          <div className="form__group">
            <h4></h4>
            <div style={{ marginBottom: 5 }}>Concerant le projet:</div>
            <div
              className="text-quote"
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                marginBottom: 10,
              }}
            >
              <div {...dataId('modificationRequest-item-nomProjet')}>
                {project.nomProjet}
              </div>
              <div
                style={{
                  fontStyle: 'italic',
                  lineHeight: 'normal',
                  fontSize: 12,
                }}
              >
                <div {...dataId('modificationRequest-item-nomCandidat')}>
                  {project.nomCandidat}
                </div>
                <span {...dataId('modificationRequest-item-communeProjet')}>
                  {project.communeProjet}
                </span>
                ,{' '}
                <span {...dataId('modificationRequest-item-departementProjet')}>
                  {project.departementProjet}
                </span>
                ,{' '}
                <span {...dataId('modificationRequest-item-regionProjet')}>
                  {project.regionProjet}
                </span>
              </div>
              <div {...dataId('modificationRequest-item-puissance')}>
                {project.puissance}{' '}
                {getunitePuissanceForAppelOffre(project.appelOffreId)}
              </div>
              <div>
                Désigné le{' '}
                <span {...dataId('modificationRequest-item-designationDate')}>
                  {formatDate(project.notifiedOn, 'DD/MM/YYYY')}
                </span>{' '}
                pour la période{' '}
                <span {...dataId('modificationRequest-item-periode')}>
                  {project.periodeId}
                </span>{' '}
                <span {...dataId('modificationRequest-item-famille')}>
                  {project.familleId}
                </span>
              </div>
            </div>
            {error ? (
              <div
                className="notification error"
                {...dataId('modificationRequest-errorMessage')}
              >
                {error}
              </div>
            ) : (
              ''
            )}
            {success ? (
              <div
                className="notification success"
                {...dataId('modificationRequest-successMessage')}
              >
                {success}
              </div>
            ) : (
              ''
            )}
            {action === 'puissance' ? (
              <>
                <label>
                  Puissance actuelle (en{' '}
                  {getunitePuissanceForAppelOffre(project.appelOffreId)})
                </label>
                <input
                  type="text"
                  disabled
                  value={project.puissance}
                  {...dataId('modificationRequest-presentPuissanceField')}
                />
                <label className="required" htmlFor="puissance">
                  Nouvelle puissance (en{' '}
                  {getunitePuissanceForAppelOffre(project.appelOffreId)})
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]+([\.,][0-9]+)?"
                  name="puissance"
                  id="puissance"
                  defaultValue={puissance || ''}
                  {...dataId('modificationRequest-puissanceField')}
                />
                <div
                  className="notification warning"
                  style={{ display: 'none' }}
                  {...dataId(
                    'modificationRequest-puissance-error-message-out-of-bounds'
                  )}
                >
                  La nouvelle puissance doit être située entre 90% et 100% de la
                  puissance actuelle pour être acceptée.
                </div>
                <div
                  className="notification error"
                  style={{ display: 'none' }}
                  {...dataId(
                    'modificationRequest-puissance-error-message-wrong-format'
                  )}
                >
                  Le format saisi n'est pas conforme (penser à utiliser un
                  nombre décimal séparé par un point).
                </div>
              </>
            ) : (
              ''
            )}
            {/* {action === 'fournisseur' ? (
              <>
                <label>Ancien fournisseur</label>
                <input type="text" disabled defaultValue={project.fournisseur} />
                <label className="required" htmlFor="fournisseur">
                  Nouveau fournisseur
                </label>
                <input
                  type="text"
                  name="fournisseur"
                  id="fournisseur"
                  defaultValue={fournisseur || ''}
                  {...dataId('modificationRequest-fournisseurField')}
                />
                <label>Ancienne évaluation carbone</label>
                <input
                  type="text"
                  disabled
                  defaultValue={project.evaluationCarbone + ' kg eq CO2/kWc'}
                />
                <label className="required" htmlFor="fournisseur">
                  Nouvelle évaluation carbone (kg eq CO2/kWc)
                </label>
                <input
                  type="text"
                  name="evaluationCarbone"
                  id="evaluationCarbone"
                  defaultValue={evaluationCarbone || ''}
                  {...dataId('modificationRequest-evaluationCarboneField')}
                />
                <label className="required" htmlFor="candidats">
                  Pièce-jointe
                </label>
                <input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-fileField')}
                  id="file"
                />
                <label className="required" htmlFor="justification">
                  Pour la raison suivante:
                </label>
                <textarea
                  name="justification"
                  id="justification"
                  defaultValue={justification || ''}
                  {...dataId('modificationRequest-justificationField')}
                />
              </>
            ) : (
              ''
            )} */}
            {action === 'producteur' ? (
              <>
                <label>Ancien producteur</label>
                <input
                  type="text"
                  disabled
                  defaultValue={project.nomCandidat}
                />
                <label className="required" htmlFor="producteur">
                  Nouveau producteur
                </label>
                <input
                  type="text"
                  name="producteur"
                  id="producteur"
                  defaultValue={producteur || ''}
                  {...dataId('modificationRequest-producteurField')}
                />
                <label className="required" htmlFor="candidats">
                  Statuts mis à jour
                </label>
                <input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-fileField')}
                  id="file"
                />
                <label htmlFor="justification">Motif (facultatif):</label>
                <textarea
                  name="justification"
                  id="justification"
                  defaultValue={justification || ''}
                  {...dataId('modificationRequest-justificationField')}
                />
              </>
            ) : (
              ''
            )}
            {action === 'actionnaire' ? (
              <>
                <label>Ancien actionnaire</label>
                <input
                  type="text"
                  disabled
                  defaultValue={project.actionnaire}
                />
                <label className="required" htmlFor="actionnaire">
                  Nouvel actionnaire
                </label>
                <input
                  type="text"
                  name="actionnaire"
                  id="actionnaire"
                  defaultValue={actionnaire || ''}
                  {...dataId('modificationRequest-actionnaireField')}
                />
                <label className="required" htmlFor="candidats">
                  Statuts mis à jour
                </label>
                <input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-fileField')}
                  id="file"
                />
                <label htmlFor="justification">Motif (facultatif):</label>
                <textarea
                  name="justification"
                  id="justification"
                  defaultValue={justification || ''}
                  {...dataId('modificationRequest-justificationField')}
                />
              </>
            ) : (
              ''
            )}
            {action === 'abandon' ? (
              <>
                <label className="required" htmlFor="justification">
                  Pour la raison suivante:
                </label>
                <textarea
                  name="justification"
                  id="justification"
                  defaultValue={justification || ''}
                  {...dataId('modificationRequest-justificationField')}
                />
                <label htmlFor="candidats">
                  Pièce justificative (si nécessaire)
                </label>
                <input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-fileField')}
                  id="file"
                />
              </>
            ) : (
              ''
            )}
            {action === 'recours' ? (
              <>
                <label className="required" htmlFor="justification">
                  Pour la raison suivante:
                </label>
                <textarea
                  name="justification"
                  id="justification"
                  defaultValue={justification || ''}
                  {...dataId('modificationRequest-justificationField')}
                />
                <label htmlFor="candidats">
                  Pièce justificative (si nécessaire)
                </label>
                <input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-fileField')}
                  id="file"
                />
              </>
            ) : (
              ''
            )}
            {action === 'delai' ? (
              <>
                <label>Date théorique de mise en service</label>
                <input
                  type="text"
                  disabled
                  defaultValue={formatDate(
                    +moment(project.notifiedOn).add(
                      getDelayForAppelOffre(project.appelOffreId),
                      'months'
                    ),
                    'DD/MM/YYYY'
                  )}
                  {...dataId('modificationRequest-presentServiceDateField')}
                />
                <label className="required" htmlFor="delayedServiceDate">
                  Date souhaitée (format JJ/MM/AAAA)
                </label>
                <input
                  type="text"
                  name="delayedServiceDate"
                  id="delayedServiceDate"
                  defaultValue={
                    delayedServiceDate
                      ? formatDate(Number(delayedServiceDate), 'DD/MM/YYYY')
                      : ''
                  }
                  {...dataId('modificationRequest-delayedServiceDateField')}
                />
                <div
                  className="notification error"
                  style={{ display: 'none' }}
                  {...dataId(
                    'modificationRequest-delay-error-message-out-of-bounds'
                  )}
                >
                  Merci de saisir une date postérieure à la date théorique de
                  mise en service.
                </div>
                <div
                  className="notification error"
                  style={{ display: 'none' }}
                  {...dataId(
                    'modificationRequest-delay-error-message-wrong-format'
                  )}
                >
                  Le format de la date saisie n'est pas conforme. Elle doit être
                  de la forme JJ/MM/AAAA soit par exemple 25/05/2022 pour 25 Mai
                  2022.
                </div>
                <label className="required" htmlFor="justification">
                  Pour la raison suivante:
                </label>
                <textarea
                  name="justification"
                  id="justification"
                  defaultValue={justification || ''}
                  {...dataId('modificationRequest-justificationField')}
                />
                <label htmlFor="candidats">
                  Pièce justificative (si nécessaire)
                </label>
                <input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-fileField')}
                  id="file"
                />
              </>
            ) : (
              ''
            )}

            <button
              className="button"
              type="submit"
              name="submit"
              id="submit"
              {...dataId('submit-button')}
            >
              Envoyer
            </button>
            <a
              className="button-outline primary"
              // style={{
              //   position: 'relative',
              //   top: 15
              // }}
              {...dataId('cancel-button')}
              href={ROUTES.USER_LIST_PROJECTS}
            >
              Annuler
            </a>
          </div>
        </form>
      </div>
    </UserDashboard>
  )
}
