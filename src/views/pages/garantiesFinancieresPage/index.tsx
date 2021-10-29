import { Request } from 'express'
import querystring from 'querystring'
import React from 'react'
import { AppelOffre, Famille, Periode, Project } from '../../../entities'
import { dataId } from '../../../helpers/testId'
import ROUTES from '../../../routes'
import { PaginatedList } from '../../../types'
import { PageLayout, RoleBasedDashboard } from '../../components'
import { DownloadIcon } from '../../components/downloadIcon'
import ProjectList from '../../components/projectList'
import { hydrateOnClient } from '../../helpers'

interface GarantiesFinancieresProps {
  request: Request
  projects?: PaginatedList<Project>
  appelsOffre: Array<AppelOffre>
  existingAppelsOffres: Array<AppelOffre['id']>
  existingPeriodes?: Array<Periode['id']>
  existingFamilles?: Array<Famille['id']>
}

/* Pure component */
export const GarantiesFinancieres = PageLayout(({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
}: GarantiesFinancieresProps) => {
  const {
    error,
    success,
    recherche,
    appelOffreId,
    periodeId,
    familleId,
    garantiesFinancieres,
  } = (request.query as any) || {}

  const hasFilters =
    appelOffreId || periodeId || familleId || garantiesFinancieres

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id))

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id))

  return (
    <RoleBasedDashboard role={request.user.role} currentPage="list-garanties-financieres">
      <div className="panel">
        <div className="panel__header">
          <h3>Garanties financières</h3>
          <form
            action={ROUTES.ADMIN_GARANTIES_FINANCIERES}
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
                placeholder="Nom projet, candidat, numéro CRE, commune, département, ..."
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
              <div
                {...dataId('visibility-toggle')}
                className={'filter-toggle' + (hasFilters ? ' open' : '')}
              >
                <span
                  style={{
                    borderBottom: '1px solid var(--light-grey)',
                    paddingBottom: 5,
                  }}
                >
                  Filtrer
                </span>
                <svg className="icon filter-icon">
                  <use xlinkHref="#expand"></use>
                </svg>
              </div>
              <div className="filter-panel">
                <div className="periode-panel">
                  <div style={{ marginLeft: 2 }}>Par appel d'offre, période et famille</div>
                  <select
                    name="appelOffreId"
                    className={'appelOffre ' + (appelOffreId ? 'active' : '')}
                    {...dataId('appelOffreIdSelector')}
                    defaultValue={appelOffreId}
                  >
                    <option value="">Tous appels d'offres</option>
                    {appelsOffre
                      .filter((appelOffre) => existingAppelsOffres.includes(appelOffre.id))
                      .map((appelOffre) => (
                        <option key={'appel_' + appelOffre.id} value={appelOffre.id}>
                          {appelOffre.shortTitle}
                        </option>
                      ))}
                  </select>
                  <select
                    name="periodeId"
                    className={periodeId ? 'active' : ''}
                    {...dataId('periodeIdSelector')}
                    defaultValue={periodeId}
                  >
                    <option value="">Toutes périodes</option>
                    {periodes && periodes.length
                      ? periodes.map((periode) => (
                          <option key={'appel_' + periode.id} value={periode.id}>
                            {periode.title}
                          </option>
                        ))
                      : null}
                  </select>
                  {!appelOffreId || (familles && familles.length) ? (
                    <select
                      name="familleId"
                      className={familleId ? 'active' : ''}
                      {...dataId('familleIdSelector')}
                      defaultValue={familleId}
                    >
                      <option value="">Toutes familles</option>
                      {familles && familles.length
                        ? familles.map((famille) => (
                            <option key={'appel_' + famille.id} value={famille.id}>
                              {famille.title}
                            </option>
                          ))
                        : null}
                    </select>
                  ) : null}
                </div>
                <div style={{ marginTop: 15 }}>
                  <div style={{ marginLeft: 2 }}>Garanties Financières</div>
                  <select
                    name="garantiesFinancieres"
                    className={garantiesFinancieres ? 'active' : ''}
                    {...dataId('garantiesFinancieresSelector')}
                    defaultValue={garantiesFinancieres || ''}
                  >
                    <option value="">Toutes</option>
                    <option value="submitted">Déposées</option>
                    <option value="notSubmitted">Non-déposées</option>
                    <option value="pastDue">En retard</option>
                  </select>
                </div>
              </div>
            </div>
            {hasFilters ? (
              <a style={{ marginTop: 10 }} href="#" {...dataId('resetSelectors')}>
                Retirer tous les filtres
              </a>
            ) : null}
          </form>
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
        {projects ? (
          <>
            <div className="pagination__count">
              <strong>{Array.isArray(projects) ? projects.length : projects.itemCount}</strong>{' '}
              projets
              <a
                href={`${ROUTES.DOWNLOAD_PROJECTS_CSV}?${querystring.stringify(
                  request.query as any
                )}`}
                download
              >
                <DownloadIcon />
              </a>
            </div>
            <ProjectList
              displayColumns={[
                'Projet',
                'Candidat',
                'Puissance',
                'Garanties Financières',
                'Evaluation Carbone',
                'Classé',
              ]}
              projects={projects}
              role={request.user?.role}
            />
          </>
        ) : (
          'Aucun projet à lister'
        )}
      </div>
    </RoleBasedDashboard>
  )}
)

hydrateOnClient(GarantiesFinancieres)
