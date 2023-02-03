import { Request } from 'express'
import querystring from 'querystring'
import React from 'react'
import { AppelOffre, Famille, Periode } from '@entities'
import { dataId } from '../../../helpers/testId'
import ROUTES from '@routes'
import { PaginatedList } from '../../../types'
import {
  ProjectList,
  PageTemplate,
  SuccessBox,
  ErrorBox,
  Link,
  Heading1,
  DownloadLink,
} from '@components'
import { hydrateOnClient, refreshPageWithNewSearchParamValue } from '../../helpers'
import { GarantiesFinancieresFilter } from './components'
import { ProjectListItem } from '@modules/project/queries'

export type GarantiesFinancieresProps = {
  request: Request
  projects: PaginatedList<ProjectListItem>
  appelsOffre: Array<AppelOffre>
  existingAppelsOffres: Array<AppelOffre['id']>
  existingPeriodes?: Array<Periode['id']>
  existingFamilles?: Array<Famille['id']>
}

export const GarantiesFinancieres = ({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
}: GarantiesFinancieresProps) => {
  const { error, success, recherche, appelOffreId, periodeId, familleId, garantiesFinancieres } =
    (request.query as any) || {}

  const hasFilters = appelOffreId || periodeId || familleId

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id))

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id))

  const handleGarantiesFinancieresFilterOnChange = (newValue: string) => {
    refreshPageWithNewSearchParamValue('garantiesFinancieres', newValue)
  }

  return (
    <PageTemplate user={request.user} currentPage="list-garanties-financieres">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Garanties financières</Heading1>

          <form
            action={ROUTES.ADMIN_GARANTIES_FINANCIERES}
            method="GET"
            style={{ maxWidth: 'auto', margin: '0 0 15px 0' }}
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
              <div {...dataId('visibility-toggle')} className={'filter-toggle open'}></div>
              <div className="filter-panel">
                <div className="periode-panel">
                  <div style={{ marginLeft: 2 }}>Filtrer par appel d'offre, période et famille</div>
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
              </div>
            </div>
            {hasFilters && (
              <Link className="mt-[10px]" href="#" {...dataId('resetSelectors')}>
                Retirer tous les filtres
              </Link>
            )}

            <GarantiesFinancieresFilter
              defaultValue={garantiesFinancieres}
              onChange={handleGarantiesFinancieresFilterOnChange}
            />
          </form>
        </div>
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}
        {projects ? (
          <>
            <div className="mb-8">
              <DownloadLink
                fileUrl={`${ROUTES.DOWNLOAD_PROJECTS_CSV}?${querystring.stringify(
                  request.query as any
                )}`}
              >
                Télécharger les{' '}
                <span>{Array.isArray(projects) ? projects.length : projects.itemCount}</span>{' '}
                projets (document csv)
              </DownloadLink>
            </div>
            <ProjectList
              displayGF={true}
              projects={projects}
              role={request.user?.role}
              GFPastDue={garantiesFinancieres === 'pastDue'}
            />
          </>
        ) : (
          'Aucun projet à lister'
        )}
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(GarantiesFinancieres)
