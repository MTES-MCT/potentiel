import AdminDashboard from '../components/adminDashboard'

import React from 'react'
import moment from 'moment'
import pagination from '../../__tests__/fixtures/pagination'

import { Project, AppelOffre, Periode } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import ProjectList from '../components/projectList'
import { HttpRequest } from '../../types'

interface AdminNotifyCandidatesProps {
  request: HttpRequest
  projects: Array<Project>
  appelsOffre: Array<AppelOffre>
  selectedAppelOffreId: AppelOffre['id']
  selectedPeriodeId: Periode['id']
}

/* Pure component */
export default function AdminNotifyCandidates({
  request,
  projects,
  appelsOffre,
  selectedAppelOffreId,
  selectedPeriodeId,
}: AdminNotifyCandidatesProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard role={request.user?.role} currentPage="notify-candidates">
      <div className="panel">
        <div className="panel__header">
          <h3>Projets à notifier</h3>
          <input
            type="text"
            className="table__filter"
            placeholder="Filtrer les projets"
          />
        </div>
        <form
          action={ROUTES.ADMIN_NOTIFY_CANDIDATES_ACTION}
          method="post"
          style={{ maxWidth: 'auto', margin: '0 0 15px 0' }}
        >
          <div className="form__group">
            <legend>AO et Période</legend>
            <select
              name="appelOffreId"
              id="appelOffreId"
              {...dataId('appelOffreSelector')}
            >
              {appelsOffre.map((appelOffre) => (
                <option
                  key={'appel_' + appelOffre.id}
                  value={appelOffre.id}
                  selected={appelOffre.id === selectedAppelOffreId}
                >
                  {appelOffre.shortTitle}
                </option>
              ))}
            </select>
            <select
              name="periodeId"
              id="periodeId"
              {...dataId('periodeSelector')}
            >
              {appelsOffre
                .find((ao) => ao.id === selectedAppelOffreId)
                ?.periodes.filter((periode) => !!periode.canGenerateCertificate)
                .map((periode) => (
                  <option
                    key={'appel_' + periode.id}
                    value={periode.id}
                    selected={periode.id === selectedPeriodeId}
                  >
                    {periode.title}
                  </option>
                ))}
            </select>
          </div>
          {projects?.length ? (
            <div className="form__group">
              <label htmlFor="notificationDate">
                Date désignation (format JJ/MM/AAAA)
              </label>
              <input
                type="text"
                name="notificationDate"
                id="notificationDate"
                value={moment().format('DD/MM/YYYY')}
                {...dataId('modificationRequest-notificationDateField')}
                style={{ width: 'auto' }}
              />
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('submit-button')}
              >
                Envoyer la notifications aux {projects.length} candidats
              </button>
            </div>
          ) : (
            ''
          )}
        </form>

        {success ? (
          <div className="notification success" {...dataId('success-message')}>
            {success}
          </div>
        ) : (
          ''
        )}
        {error ? (
          <div className="notification error" {...dataId('error-message')}>
            {error}
          </div>
        ) : (
          ''
        )}
        <ProjectList
          projects={projects}
          projectActions={(project: Project) => [
            ...(process.env.NODE_ENV === 'production'
              ? []
              : [
                  {
                    title: "M'envoyer le mail de notification",
                    link: ROUTES.ADMIN_SEND_COPY_OF_CANDIDATE_NOTIFICATION_ACTION(
                      {
                        appelOffreId: project.appelOffreId,
                        periodeId: project.periodeId,
                        email: project.email,
                      }
                    ),
                    actionId: 'send-copy-of-notification',
                  },
                ]),
            {
              title: 'Aperçu attestation',
              link: ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS(project),
              isDownload: true,
            },
          ]}
        />
      </div>
    </AdminDashboard>
  )
}
