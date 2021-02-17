import AdminDashboard from '../components/adminDashboard'

import React from 'react'
import { formatDate } from '../../helpers/formatDate'
import pagination from '../../__tests__/fixtures/pagination'

import { Project, AppelOffre, Periode, Famille } from '../../entities'
import { AppelOffreDTO, PeriodeDTO } from '../../useCases/listUnnotifiedProjects'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import ProjectList from '../components/projectList'
import { PaginatedList } from '../../types'
import { Request } from 'express'

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
  const { error, success, recherche, classement } = request.query || {}

  if (!results) {
    // All projects have been notified
    return (
      <AdminDashboard role={request.user?.role} currentPage="notify-candidates">
        <div className="panel">
          <div className="panel__header">
            <h3>Projets à notifier</h3>
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
          <h3>Projets à notifier</h3>
          <form
            action={ROUTES.ADMIN_NOTIFY_CANDIDATES()}
            method="GET"
            style={{ maxWidth: 'auto', margin: '0 0 25px 0' }}
          >
            <div className="form__group" style={{ marginTop: 20 }}>
              <input
                type="text"
                name="recherche"
                {...dataId('recherche-field')}
                style={{ paddingRight: 40 }}
                defaultValue={recherche || ''}
              />
              <button
                className="overlay-button"
                style={{
                  right: 10,
                  top: 10,
                  width: 30,
                  height: 30,
                }}
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
                <div style={{ marginTop: 15 }}>
                  <div style={{ marginLeft: 2 }}>Classés/Eliminés</div>
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
        <form
          action={ROUTES.ADMIN_NOTIFY_CANDIDATES_ACTION}
          method="post"
          style={{ maxWidth: 'auto', margin: '0 0 15px 0' }}
        >
          <div className="form__group">
            <legend>AO et Période</legend>
            <select name="appelOffreId" id="appelOffreId" {...dataId('appelOffreIdSelector')}>
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
                style={{ width: 'auto' }}
              />
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('submit-button')}
              >
                Envoyer la notifications aux {projectsInPeriodCount} candidats de cette période
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
          displayColumns={[
            'Projet',
            'Candidat',
            'Puissance',
            'Prix',
            'Evaluation Carbone',
            'Classé',
          ]}
          projectActions={(project) => [
            {
              title: 'Aperçu attestation',
              link: ROUTES.PREVIEW_CANDIDATE_CERTIFICATE(project),
              isDownload: true,
            },
          ]}
        />
      </div>
    </AdminDashboard>
  )
}
