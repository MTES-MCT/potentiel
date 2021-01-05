import React from 'react'

import { dataId } from '../../../helpers/testId'

import { Project } from '../../../entities'

import AdminDashboard from '../../components/adminDashboard'
import UserDashboard from '../../components/userDashboard'
import { HttpRequest } from '../../../types'
import ROUTES from '../../../routes'

import { formatDate } from '../../../helpers/formatDate'

import moment from 'moment'
import { ModificationRequestPageDTO } from '../../../modules/modificationRequest'
import {
  ModificationRequestTitleByType,
  ModificationRequestStatusTitle,
  ModificationRequestColorByStatus,
} from '../../helpers'
import { DownloadIcon } from '../../components'
moment.locale('fr')

interface PageProps {
  request: HttpRequest
  modificationRequest: ModificationRequestPageDTO
}

const TITLE_COLOR_BY_STATUS = (status: string): string => {
  console.log('status', status)
  if (status.includes('accepté')) return 'rgb(56, 118, 29)'
  if (status.includes('rejeté')) return 'rgb(204, 0, 0)'

  return ''
}

/* Pure component */
export default function AdminModificationRequestPage({ request, modificationRequest }: PageProps) {
  const { user } = request
  const { error, success } = request.query
  const {
    project,
    type,
    status,
    requestedOn,
    requestedBy,
    respondedOn,
    respondedBy,
    attachmentFile,
    justification,
    versionDate,
  } = modificationRequest

  if (!user) {
    // Should never happen
    console.log('Try to render ProjectDetails without a user')
    return <div />
  }

  const isAdmin = user.role !== 'porteur-projet'

  const Dashboard = isAdmin ? AdminDashboard : UserDashboard

  return (
    <Dashboard role={user.role} currentPage={'list-requests'}>
      <div className="panel">
        <div className="panel__header" style={{ position: 'relative' }}>
          <h3>Demande de {ModificationRequestTitleByType[type]}</h3>
        </div>
        <div className="panel__header">
          <div>
            Déposée par {requestedBy} le {formatDate(requestedOn)}
          </div>
          {justification ? (
            <div style={{ fontStyle: 'italic', marginTop: 5 }}>
              {'"'}
              {justification}
              {'"'}
            </div>
          ) : (
            ''
          )}
          {attachmentFile ? (
            <div style={{ marginTop: 10 }}>
              <DownloadIcon />
              <a
                href={ROUTES.DOWNLOAD_PROJECT_FILE(attachmentFile.id, attachmentFile.filename)}
                download={true}
                {...dataId('requestList-item-download-link')}
              >
                Télécharger la pièce-jointe
              </a>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="panel__header">
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
              <a href={ROUTES.PROJECT_DETAILS(project.id)}>{project.nomProjet}</a>
            </div>
            <div
              style={{
                fontStyle: 'italic',
                lineHeight: 'normal',
                fontSize: 12,
              }}
            >
              <div {...dataId('modificationRequest-item-nomCandidat')}>{project.nomCandidat}</div>
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
              {project.puissance} {project.unitePuissance}
            </div>
            <div>
              Désigné le{' '}
              <span {...dataId('modificationRequest-item-designationDate')}>
                {formatDate(project.notifiedOn)}
              </span>{' '}
              pour la période{' '}
              <span {...dataId('modificationRequest-item-periode')}>
                {project.appelOffreId} {project.periodeId}
              </span>{' '}
              <span {...dataId('modificationRequest-item-famille')}>{project.familleId}</span>
            </div>
          </div>
          {error ? (
            <div className="notification error" {...dataId('modificationRequest-errorMessage')}>
              {error}
            </div>
          ) : (
            ''
          )}
          {success ? (
            <div className="notification success" {...dataId('modificationRequest-successMessage')}>
              {success}
            </div>
          ) : (
            ''
          )}
        </div>
        {isAdmin ? (
          type === 'recours' && !modificationRequest.respondedOn ? (
            <div>
              <h4>Répondre</h4>
              <div style={{ marginBottom: 10 }}>
                <DownloadIcon />
                <a
                  href={ROUTES.TELECHARGER_MODELE_REPONSE_RECOURS(
                    (project as unknown) as Project,
                    modificationRequest.id
                  )}
                  download={true}
                >
                  Télécharger un modèle de réponse
                </a>
              </div>

              <form
                action={ROUTES.ADMIN_REPLY_TO_MODIFICATION_REQUEST}
                method="post"
                encType="multipart/form-data"
                style={{ margin: 0 }}
              >
                <input type="hidden" name="modificationRequestId" value={modificationRequest.id} />
                <input type="hidden" name="type" value={modificationRequest.type} />
                <input type="hidden" name="versionDate" value={versionDate.getTime()} />

                <div className="form__group">
                  <label htmlFor="file">Réponse signée (fichier pdf)</label>
                  <input type="file" name="file" id="file" />
                </div>

                <div className="form__group" style={{ marginTop: 5 }}>
                  <label htmlFor="newNotificationDate">
                    Nouvelle date de désignation (format JJ/MM/AAAA)
                  </label>
                  <input
                    type="text"
                    name="newNotificationDate"
                    id="newNotificationDate"
                    defaultValue={formatDate(Date.now(), 'DD/MM/YYYY')}
                    {...dataId('modificationRequest-newNotificationDateField')}
                    style={{ width: 'auto' }}
                  />
                </div>

                <button
                  className="button"
                  type="submit"
                  name="submitAccept"
                  data-confirm={`Etes-vous sur de vouloir accepter la demande de ${ModificationRequestTitleByType[type]} ?`}
                  {...dataId('submit-button')}
                >
                  Accepter la demande de {ModificationRequestTitleByType[type]}
                </button>
                <button
                  className="button warning"
                  type="submit"
                  data-confirm={`Etes-vous sur de vouloir refuser la demande de ${ModificationRequestTitleByType[type]} ?`}
                  name="submitRefuse"
                  {...dataId('submit-button-alt')}
                >
                  Refuser la demande de {ModificationRequestTitleByType[type]}
                </button>
              </form>
            </div>
          ) : (
            ''
          )
        ) : (
          ''
        )}
        {respondedBy && respondedOn ? (
          <div
            className={'notification ' + (status ? ModificationRequestColorByStatus[status] : '')}
            style={{ color: TITLE_COLOR_BY_STATUS(status) }}
          >
            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              {ModificationRequestStatusTitle[status]}
            </span>{' '}
            par {respondedBy} le {formatDate(respondedOn)}
          </div>
        ) : (
          ''
        )}
      </div>
    </Dashboard>
  )
}
