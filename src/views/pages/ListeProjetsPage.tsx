import { Request } from 'express'
import querystring from 'querystring'
import React, { useState } from 'react'
import { AppelOffre, Famille, Periode } from '@entities'
import { dataId } from '../../helpers/testId'
import ROUTES from '@routes'
import { PaginatedList } from '../../types'

import {
  ProjectList,
  ExcelFileIcon,
  SecondaryLinkButton,
  PageTemplate,
  SuccessBox,
  ErrorBox,
  Button,
  Input,
  Label,
  Link,
} from '@components'
import { hydrateOnClient } from '../helpers'
import { ProjectListItem } from '@modules/project'
import { userIsNot } from '@modules/users'

type ListeProjetsProps = {
  request: Request
  projects: PaginatedList<ProjectListItem>
  appelsOffre: Array<AppelOffre>
  existingAppelsOffres: Array<AppelOffre['id']>
  existingPeriodes?: Array<Periode['id']>
  existingFamilles?: Array<Famille['id']>
}

export const ListeProjets = ({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
}: ListeProjetsProps) => {
  const {
    error,
    success,
    recherche,
    appelOffreId,
    periodeId,
    familleId,
    garantiesFinancieres,
    classement,
    reclames,
  } = (request.query as any) || {}

  const hasNonDefaultClassement =
    (request.user?.role === 'porteur-projet' && classement) ||
    (request.user &&
      ['admin', 'dreal', 'dgec-validateur'].includes(request.user?.role) &&
      classement !== 'classés')

  const hasFilters =
    appelOffreId || periodeId || familleId || garantiesFinancieres || hasNonDefaultClassement

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id))

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id))

  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])
  const [displaySelection, setDisplaySelection] = useState(false)

  return (
    <PageTemplate user={request.user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <h3>{request.user.role === 'porteur-projet' ? 'Mes Projets' : 'Projets'}</h3>
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}

          <form
            action={ROUTES.LISTE_PROJETS}
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
                placeholder="Rechercher par nom du projet"
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
                {[
                  'admin',
                  'dreal',
                  'dgec-validateur',
                  'porteur-projet',
                  'caisse-des-dépôts',
                ].includes(request.user.role) && (
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
                )}
                <div style={{ marginTop: 15 }}>
                  <div style={{ marginLeft: 2 }}>Classés/Eliminés/Abandons</div>
                  <select
                    name="classement"
                    className={hasNonDefaultClassement ? 'active' : ''}
                    {...dataId('classementSelector')}
                    defaultValue={classement || ''}
                  >
                    <option value="">Tous</option>
                    <option value="classés">Classés</option>
                    <option value="éliminés">Eliminés</option>
                    <option value="abandons">Abandons</option>
                  </select>
                </div>

                {userIsNot('porteur-projet')(request.user) && (
                  <div style={{ marginTop: 15 }}>
                    <div style={{ marginLeft: 2 }}>Réclamés/Non réclamés</div>
                    <select
                      name="reclames"
                      {...dataId('reclamesSelector')}
                      defaultValue={reclames || ''}
                    >
                      <option value="">Tous</option>
                      <option value="réclamés">Réclamés</option>
                      <option value="non-réclamés">Non réclamés</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            {hasFilters && (
              <Link className="mt-[10px]" href="#" {...dataId('resetSelectors')}>
                Retirer tous les filtres
              </Link>
            )}
          </form>
          {['admin', 'dgec-validateur', 'porteur-projet'].includes(request.user?.role) && (
            <div>
              <div onClick={() => setDisplaySelection(!displaySelection)} className="filter-toggle">
                <span
                  style={{
                    borderBottom: '1px solid var(--light-grey)',
                    paddingBottom: 5,
                  }}
                >
                  Donner accès à un utilisateur
                </span>
                <svg
                  className="icon filter-icon"
                  style={{ transform: displaySelection ? 'rotate(0deg)' : '' }}
                >
                  <use xlinkHref="#expand"></use>
                </svg>
              </div>
              {displaySelection && (
                <div>
                  <form
                    action={ROUTES.INVITE_USER_TO_PROJECT_ACTION}
                    method="POST"
                    name="form"
                    className="m-0 mt-4"
                  >
                    <select name="projectId" multiple hidden>
                      {selectedProjectIds.map((projectId) => (
                        <option selected key={projectId} value={projectId}>
                          {projectId}
                        </option>
                      ))}
                    </select>
                    <Label htmlFor="email" required>
                      Courrier électronique de la personne habilitée à suivre les projets
                      selectionnés ci-dessous:
                    </Label>
                    <Input
                      required
                      type="email"
                      name="email"
                      id="email"
                      {...dataId('email-field')}
                    />
                    <Button
                      className="mt-4"
                      type="submit"
                      name="submit"
                      id="submit"
                      disabled={!selectedProjectIds.length}
                    >
                      Accorder les droits sur {selectedProjectIds.length}{' '}
                      {selectedProjectIds.length > 1 ? 'projets' : 'projet'}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {projects.itemCount > 0 ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center py-2">
              <span>
                <strong>{projects.itemCount}</strong> projets
              </span>

              {projects.itemCount > 0 && (
                <SecondaryLinkButton
                  className="inline-flex items-center m-0 md:ml-auto umami--click--telecharger-un-export-projets"
                  href={`${ROUTES.DOWNLOAD_PROJECTS_CSV}?${querystring.stringify(
                    request.query as any
                  )}`}
                  download
                >
                  <ExcelFileIcon className="mr-2" />
                  Télécharger un export
                </SecondaryLinkButton>
              )}
            </div>

            <ProjectList
              displaySelection={displaySelection}
              selectedIds={selectedProjectIds}
              onSelectedIdsChanged={setSelectedProjectIds}
              {...(request.user?.role === 'dreal' && { displayGF: true })}
              projects={projects}
              role={request.user?.role}
            />
          </>
        ) : (
          'Aucun projet à lister'
        )}
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(ListeProjets)
