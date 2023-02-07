import { Request } from 'express'
import React from 'react'
import { AppelOffre, Famille, Periode, Project } from '@entities'
import { dataId } from '../../helpers/testId'
import ROUTES from '@routes'
import { PaginatedList } from '../../types'
import {
  BarreDeRecherche,
  ErrorBox,
  Heading1,
  Link,
  MissingOwnerProjectList,
  PageTemplate,
  SuccessBox,
} from '@components'
import { hydrateOnClient } from '../helpers'

interface ProjetsÀRéclamerProps {
  request: Request
  projects?: PaginatedList<Project>
  appelsOffre: Array<AppelOffre>
  existingAppelsOffres: Array<AppelOffre['id']>
  existingPeriodes?: Array<Periode['id']>
  existingFamilles?: Array<Famille['id']>
}

export const ProjetsÀRéclamer = ({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
}: ProjetsÀRéclamerProps) => {
  const { error, success, recherche, appelOffreId, periodeId, familleId, classement } =
    (request.query as any) || {}

  const hasNonDefaultClassement =
    (request.user?.role === 'porteur-projet' && classement) ||
    (request.user &&
      ['admin', 'dreal', 'dgec-validateur'].includes(request.user?.role) &&
      classement !== 'classés')

  const hasFilters = appelOffreId || periodeId || familleId || hasNonDefaultClassement

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id))

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id))

  return (
    <PageTemplate user={request.user} currentPage="list-missing-owner-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Projets à réclamer</Heading1>
          <div className="notification">
            <span>
              Pour ajouter un projet en attente d'affectation à votre suivi de projets (onglet "Mes
              projets"), sélectionnez-le, qu’il vous soit pré-affecté ou non.
              <br />
              Pour les projets qui ne vous sont pas pré-affectés, veuillez saisir le prix de
              référence tel qu'il figure dans votre attestation de désignation, ainsi que le numéro
              CRE puis téléversez l’attestation de désignation.
            </span>
          </div>
          <form
            action={ROUTES.USER_LIST_MISSING_OWNER_PROJECTS}
            method="GET"
            className="max-w-2xl lg:max-w-3xl mx-0 mb-6"
          >
            <BarreDeRecherche
              placeholder="Nom projet, nom candidat, appel d'offres, période, région"
              name="recherche"
              defaultValue={recherche || ''}
              className="mt-8"
            />

            <div className="mt-8">
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
              </div>
            </div>
            {hasFilters && (
              <Link className="mt-[10px]" href="#" {...dataId('resetSelectors')}>
                Retirer tous les filtres
              </Link>
            )}
          </form>
        </div>
        {success && <SuccessBox title={success} />}
        {error && (
          <ErrorBox>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </ErrorBox>
        )}
        {projects ? (
          <>
            <div className="m-2">
              <strong>{Array.isArray(projects) ? projects.length : projects.itemCount}</strong>{' '}
              projets
            </div>
            <MissingOwnerProjectList
              displayColumns={[
                'Projet',
                'Puissance',
                'Region',
                'Projet pre-affecte',
                'Prix',
                'N° CRE',
                'Attestation de designation',
              ]}
              projects={projects}
              user={request.user}
            />
          </>
        ) : (
          'Aucun projet à lister'
        )}
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(ProjetsÀRéclamer)
