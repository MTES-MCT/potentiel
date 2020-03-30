import React from 'react'

import { Project } from '../../entities'

import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import UserDashboard from '../components/userDashboard'
import { HttpRequest } from '../../types'

import moment from 'moment'

moment.locale('fr')

interface PageProps {
  request: HttpRequest
  project: Project
}

const titlePerAction = {
  fournisseur: 'changement de fournisseur',
  delai: 'délai supplémentaire',
  actionnaire: "changement d'actionnaire",
  puissance: 'changement de puissance',
  producteur: 'changement de producteur',
  abandon: 'abandon de mon projet'
}

export { titlePerAction }

/* Pure component */
export default function ModificationRequestPage({
  request,
  project
}: PageProps) {
  const {
    action,
    error,
    success,
    puissance,
    actionnaire,
    producteur,
    fournisseur,
    justification
  } = request.query || {}

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
                marginBottom: 10
              }}
            >
              <div {...dataId('modificationRequest-item-nomProjet')}>
                {project.nomProjet}
              </div>
              <div
                style={{
                  fontStyle: 'italic',
                  lineHeight: 'normal',
                  fontSize: 12
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
                {project.puissance} kWc
              </div>
              <div>
                Désigné le{' '}
                <span {...dataId('modificationRequest-item-designationDate')}>
                  {moment(project.notifiedOn).format('DD/MM/YYYY')}
                </span>{' '}
                pour la période{' '}
                <span {...dataId('modificationRequest-item-periode')}>
                  {project.periode}
                </span>{' '}
                <span {...dataId('modificationRequest-item-famille')}>
                  {project.famille}
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
                <label>Puissance actuelle (en kWc)</label>
                <input
                  type="text"
                  disabled
                  value={project.puissance}
                  {...dataId('modificationRequest-presentPuissanceField')}
                />
                <label className="required" htmlFor="puissance">
                  Nouvelle puissance (en kWc)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]+([\.,][0-9]+)?"
                  name="puissance"
                  id="puissance"
                  value={puissance || ''}
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
            {action === 'fournisseur' ? (
              <>
                <label>Ancien fournisseur</label>
                <input type="text" disabled value={project.fournisseur} />
                <label className="required" htmlFor="fournisseur">
                  Nouveau fournisseur
                </label>
                <input
                  type="text"
                  name="fournisseur"
                  id="fournisseur"
                  value={fournisseur || ''}
                  {...dataId('modificationRequest-fournisseurField')}
                />
              </>
            ) : (
              ''
            )}
            {action === 'producteur' ? (
              <>
                <label>Ancien producteur</label>
                <input type="text" disabled value={project.producteur} />
                <label className="required" htmlFor="producteur">
                  Nouveau producteur
                </label>
                <input
                  type="text"
                  name="producteur"
                  id="producteur"
                  value={producteur || ''}
                  {...dataId('modificationRequest-producteurField')}
                />
                <label className="required" htmlFor="candidats">
                  Statuts mis à jour
                </label>
                <input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-file-field')}
                  id="file"
                />
                <label htmlFor="justification">Motif (facultatif):</label>
                <textarea
                  name="justification"
                  id="justification"
                  value={justification || ''}
                  {...dataId('modificationRequest-justification-field')}
                />
              </>
            ) : (
              ''
            )}
            {action === 'actionnaire' ? (
              <>
                <label>Ancien actionnaire</label>
                <input type="text" disabled value={project.actionnaire} />
                <label className="required" htmlFor="actionnaire">
                  Nouvel actionnaire
                </label>
                <input
                  type="text"
                  name="actionnaire"
                  id="actionnaire"
                  value={actionnaire || ''}
                  {...dataId('modificationRequest-actionnaireField')}
                />
                <label className="required" htmlFor="candidats">
                  Statuts mis à jour
                </label>
                <input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-file-field')}
                  id="file"
                />
                <label htmlFor="justification">Motif (facultatif):</label>
                <textarea
                  name="justification"
                  id="justification"
                  value={justification || ''}
                  {...dataId('modificationRequest-justification-field')}
                />
              </>
            ) : (
              ''
            )}
            {action === 'delai' || action === 'abandon' ? (
              <>
                <label className="required" htmlFor="justification">
                  Pour la raison suivante:
                </label>
                <textarea
                  name="justification"
                  id="justification"
                  value={justification || ''}
                  {...dataId('modificationRequest-justification-field')}
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
