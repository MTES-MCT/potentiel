import AdminDashboard from '../components/adminDashboard'

import React from 'react'

import { Project, AppelOffre, Periode, Famille } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import ProjectList from '../components/projectList'
import { HttpRequest, PaginatedList } from '../../types'

interface AdminListProjectsProps {
  request: HttpRequest
  projects: PaginatedList<Project>
  appelsOffre: Array<AppelOffre>
  selectedAppelOffreId?: AppelOffre['id']
  selectedPeriodeId?: Periode['id']
  selectedFamilleId?: Famille['id']
}

/* Pure component */
export default function AdminListProjects({
  request,
  projects,
  appelsOffre,
  selectedAppelOffreId,
  selectedPeriodeId,
  selectedFamilleId,
}: AdminListProjectsProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <h3>Projets</h3>

          <div className="form__group">
            <legend>Filtrer par AO, Période et/ou Famille</legend>
            <select
              name="appelOffre"
              id="appelOffre"
              {...dataId('appelOffreSelector')}
            >
              <option value="">Tous AO</option>
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
            <select name="periode" id="periode" {...dataId('periodeSelector')}>
              <option value="">Toutes périodes</option>
              {appelsOffre
                .find((ao) => ao.id === selectedAppelOffreId)
                ?.periodes.map((periode) => (
                  <option
                    key={'appel_' + periode.id}
                    value={periode.id}
                    selected={periode.id === selectedPeriodeId}
                  >
                    {periode.title}
                  </option>
                ))}
            </select>
            <select name="famille" id="famille" {...dataId('familleSelector')}>
              <option value="">Toutes familles</option>
              {appelsOffre
                .find((ao) => ao.id === selectedAppelOffreId)
                ?.familles.sort((a, b) => a.title.localeCompare(b.title))
                .map((famille) => (
                  <option
                    key={'appel_' + famille.id}
                    value={famille.id}
                    selected={famille.id === selectedFamilleId}
                  >
                    {famille.title}
                  </option>
                ))}
            </select>
          </div>
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
        <div className="pagination__count">
          <strong>{projects.itemCount}</strong> projets
        </div>
        <div></div>
        <ProjectList
          projects={projects}
          projectActions={(project: Project, appelOffre?: AppelOffre) => {
            const periode = appelOffre?.periodes.find(
              (periode) => periode.id === project.periodeId
            )
            const canDownloadCertificate =
              periode && periode.canGenerateCertificate

            return [
              {
                title: 'Voir attestation',
                link: ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS(project),
                isDownload: true,
                disabled: !canDownloadCertificate,
              },
            ]
          }}
        />
      </div>
    </AdminDashboard>
  )
}
