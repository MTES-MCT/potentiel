import AdminDashboard from '../components/adminDashboard'
import UserDashboard from '../components/userDashboard'

import React from 'react'

import { Project, AppelOffre, Periode, Famille } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'
import { asLiteral } from '../../helpers/asLiteral'

import ProjectList from '../components/projectList'
import { adminActions, porteurProjetActions } from '../components/actions'
import { HttpRequest, PaginatedList } from '../../types'

interface ListProjectsProps {
  request: HttpRequest
  projects?: PaginatedList<Project>
  appelsOffre: Array<AppelOffre>
  existingAppelsOffres: Array<AppelOffre['id']>
  existingPeriodes?: Array<Periode['id']>
  existingFamilles?: Array<Famille['id']>
}

/* Pure component */
export default function ListProjects({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
}: ListProjectsProps) {
  const {
    error,
    success,
    recherche,
    appelOffreId,
    periodeId,
    familleId,
    garantiesFinancieres,
    classement,
  } = request.query || {}

  const hasNonDefaultClassement =
    (request.user?.role === 'porteur-projet' && classement) ||
    (request.user &&
      ['admin', 'dreal'].includes(request.user?.role) &&
      classement !== 'classés')

  const hasFilters =
    appelOffreId ||
    periodeId ||
    familleId ||
    garantiesFinancieres ||
    hasNonDefaultClassement

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter(
      (periode) => !existingPeriodes || existingPeriodes.includes(periode.id)
    )

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter(
      (famille) => !existingFamilles || existingFamilles.includes(famille.id)
    )

  const contents = (
    <>
      <div className="panel">
        <div className="panel__header">
          <h3>Projets</h3>
          <form
            action={
              request.user?.role === 'porteur-projet'
                ? ROUTES.USER_LIST_PROJECTS
                : ROUTES.ADMIN_LIST_PROJECTS
            }
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
                Filtrer
                <svg className="icon filter-icon">
                  <use xlinkHref="#expand"></use>
                </svg>
              </div>
              <div className="filter-panel">
                <div className="periode-panel">
                  <div style={{ marginLeft: 2 }}>
                    Par appel d'offre, période et famille
                  </div>
                  <select
                    name="appelOffreId"
                    className={'appelOffre ' + (appelOffreId ? 'active' : '')}
                    {...dataId('appelOffreIdSelector')}
                  >
                    <option value="">Tous appels d'offres</option>
                    {appelsOffre
                      .filter((appelOffre) =>
                        existingAppelsOffres.includes(appelOffre.id)
                      )
                      .map((appelOffre) => (
                        <option
                          key={'appel_' + appelOffre.id}
                          value={appelOffre.id}
                          selected={appelOffre.id === appelOffreId}
                        >
                          {appelOffre.shortTitle}
                        </option>
                      ))}
                  </select>
                  <select
                    name="periodeId"
                    className={periodeId ? 'active' : ''}
                    {...dataId('periodeIdSelector')}
                  >
                    <option value="">Toutes périodes</option>
                    {periodes && periodes.length
                      ? periodes.map((periode) => (
                          <option
                            key={'appel_' + periode.id}
                            value={periode.id}
                            selected={periode.id === periodeId}
                          >
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
                    >
                      <option value="">Toutes familles</option>
                      {familles && familles.length
                        ? familles.map((famille) => (
                            <option
                              key={'appel_' + famille.id}
                              value={famille.id}
                              selected={famille.id === familleId}
                            >
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
                  >
                    <option value="">Toutes</option>
                    <option
                      value="submitted"
                      selected={
                        garantiesFinancieres &&
                        garantiesFinancieres === 'submitted'
                      }
                    >
                      Déposées
                    </option>
                    <option
                      value="notSubmitted"
                      selected={
                        garantiesFinancieres &&
                        garantiesFinancieres === 'notSubmitted'
                      }
                    >
                      Non-déposées
                    </option>
                  </select>
                </div>
                <div style={{ marginTop: 15 }}>
                  <div style={{ marginLeft: 2 }}>Classés/Eliminés</div>
                  <select
                    name="classement"
                    className={hasNonDefaultClassement ? 'active' : ''}
                    {...dataId('classementSelector')}
                  >
                    <option value="">Tous</option>
                    <option
                      value="classés"
                      selected={classement && classement === 'classés'}
                    >
                      Classés
                    </option>
                    <option
                      value="éliminés"
                      selected={classement && classement === 'éliminés'}
                    >
                      Eliminés
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {hasFilters ? (
              <a
                style={{ marginTop: 10 }}
                href="#"
                {...dataId('resetSelectors')}
              >
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
              <strong>
                {Array.isArray(projects) ? projects.length : projects.itemCount}
              </strong>{' '}
              projets
            </div>
            <ProjectList
              displayColumns={[
                'Periode',
                'Projet',
                'Candidat',
                'Puissance',
                ...(request.user?.role === 'dreal' ? [] : ['Prix']),
                'Evaluation Carbone',
                'Classé',
              ]}
              projects={projects}
              projectActions={
                ['admin', 'dgec'].includes(request.user?.role || '')
                  ? adminActions
                  : request.user?.role === 'porteur-projet'
                  ? porteurProjetActions
                  : undefined
              }
            />
          </>
        ) : (
          'Aucun projet à lister'
        )}
      </div>
    </>
  )

  if (request.user?.role === 'porteur-projet') {
    return <UserDashboard currentPage="list-projects">{contents}</UserDashboard>
  }

  return (
    <AdminDashboard role={request.user?.role} currentPage="list-projects">
      {contents}
    </AdminDashboard>
  )
}
