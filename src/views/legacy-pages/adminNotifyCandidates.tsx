import { AdminDashboard, Button, DownloadIcon, ProjectList } from '@components'
import { AppelOffre, Periode, Project } from '@entities'
import ROUTES from '@routes'
import { Request } from 'express'
import querystring from 'querystring'
import React from 'react'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import { PaginatedList } from '../../types'
import { AppelOffreDTO, PeriodeDTO } from '../../useCases/listUnnotifiedProjects'

type AdminNotifyCandidatesProps = {
  request: Request
  results?: {
    projects: PaginatedList<Project>
    projectsInPeriodCount: number
    selectedAppelOffreId: AppelOffre['id']
    selectedPeriodeId: Periode['id']
    existingAppelsOffres: Array<AppelOffreDTO>
    existingPeriodes?: Array<PeriodeDTO>
  }
}

/* Pure component */
export default function AdminNotifyCandidates({ request, results }: AdminNotifyCandidatesProps) {
  const { error, success, recherche, classement } = (request.query as any) || {}
  if (!results) {
    // All projects have been notified
    return (
      <AdminDashboard role={request.user?.role} currentPage="notify-candidates">
        <div className="panel">
          <div className="panel__header">
            <h3>Notifier les candidats</h3>
          </div>
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
          <div>Tous les candidats ont été notifiés</div>
        </div>
      </AdminDashboard>
    )
  }

  const {
    projects,
    projectsInPeriodCount,
    selectedAppelOffreId,
    selectedPeriodeId,
    existingAppelsOffres,
    existingPeriodes,
  } = results

  const hasFilters = classement && classement !== ''

  return (
    <AdminDashboard role={request.user?.role} currentPage="notify-candidates">
      <div className="panel">
        <div className="panel__header">
          <h3>Notifier les candidats</h3>
          {request.user.role !== 'dgec-validateur' && (
            <p>
              Seules les personnes ayant délégation de signature sont habilitées à notifier un appel
              d'offres. <br />
              Il est néanmoins possible de consulter les attestations qui seront envoyées aux
              porteurs de projets.
            </p>
          )}
          <form action={ROUTES.ADMIN_NOTIFY_CANDIDATES()} method="GET" className="ml-0 mb-4">
            <div className="form__group mt-5">
              <input
                type="text"
                name="recherche"
                {...dataId('recherche-field')}
                className="pr-10"
                defaultValue={recherche || ''}
              />
              <button
                className="overlay-button top-2.5 right-2.5 w-8 h-8"
                type="submit"
                {...dataId('submit-button')}
              >
                <svg
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="var(--grey)"
                  width="20"
                  height="20"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>

            <div className="form__group">
              <legend
                {...dataId('visibility-toggle')}
                className={'filter-toggle' + (hasFilters ? ' open' : '')}
              >
                Filtrer
                <svg className="icon filter-icon">
                  <use xlinkHref="#expand"></use>
                </svg>
              </legend>
              <div className="filter-panel">
                <div className="mt-4">
                  <div className="ml-0.5">Classés/Eliminés</div>
                  <select
                    name="classement"
                    className={classement ? 'active' : ''}
                    {...dataId('classementSelector')}
                  >
                    <option value="">Tous</option>
                    <option value="classés" selected={classement && classement === 'classés'}>
                      Classés
                    </option>
                    <option value="éliminés" selected={classement && classement === 'éliminés'}>
                      Eliminés
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
        <form action={ROUTES.ADMIN_NOTIFY_CANDIDATES_ACTION} method="post" className="ml-0 mb-4">
          <div className="form__group">
            <select
              name="appelOffreId"
              id="appelOffreId"
              {...dataId('appelOffreIdSelector')}
              className="mr-1"
            >
              {existingAppelsOffres.map((appelOffre) => (
                <option
                  key={'appel_' + appelOffre.id}
                  value={appelOffre.id}
                  selected={appelOffre.id === selectedAppelOffreId}
                >
                  {appelOffre.shortTitle}
                </option>
              ))}
            </select>
            <select name="periodeId" id="periodeId" {...dataId('periodeIdSelector')}>
              {existingPeriodes?.map((periode) => (
                <option
                  key={'appel_' + periode.id}
                  value={periode.id}
                  selected={periode.id === selectedPeriodeId}
                >
                  {periode.title}
                </option>
              ))}
            </select>

            {selectedAppelOffreId && selectedPeriodeId && (
              <div className="mt-4">
                <a
                  href={`
                ${ROUTES.ADMIN_DOWNLOAD_PROJECTS_LAUREATS_CSV}?${querystring.stringify({
                    ...request.query,
                    appelOffreId: selectedAppelOffreId,
                    periodeId: selectedPeriodeId,
                    beforeNotification: true,
                  })}`}
                  download
                >
                  Liste des lauréats
                  <DownloadIcon color="red" />
                </a>
              </div>
            )}
          </div>
          {projectsInPeriodCount && !success ? (
            <div className="form__group">
              <label htmlFor="notificationDate">Date désignation (format JJ/MM/AAAA)</label>
              <input
                type="text"
                name="notificationDate"
                id="notificationDate"
                defaultValue={formatDate(Date.now(), 'DD/MM/YYYY')}
                {...dataId('modificationRequest-notificationDateField')}
                className="w-auto"
              />
              {request.user?.role === 'dgec-validateur' && (
                <Button
                  type="submit"
                  name="submit"
                  id="submit"
                  className="mt-4"
                  {...dataId('submit-button')}
                >
                  Envoyer la notification aux {projectsInPeriodCount} candidats de cette période
                </Button>
              )}
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
          displayColumns={[
            'Projet',
            'Candidat',
            'Puissance',
            'Prix',
            'Evaluation Carbone',
            'Classé',
          ]}
          role={request.user?.role}
        />
      </div>
    </AdminDashboard>
  )
}
