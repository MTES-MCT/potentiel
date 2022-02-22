import React, { useState } from 'react'
import moment from 'moment'
import { Project } from '@entities'
import ROUTES from '../../../routes'
import { dataId } from '../../../helpers/testId'
import UserDashboard from '../../components/UserDashboard'
import { Request } from 'express'
import { formatDate } from '../../../helpers/formatDate'
import { PageLayout } from '../../components/PageLayout'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'
import ModificationRequestActionTitles from '../../components/ModificationRequestActionTitles'
import { CDCChoiceForm } from '../../components/CDCChoiceForm'
import { getDelaiDeRealisation } from '@modules/projectAppelOffre'
import { ChangementFournisseur, ChangementPuissance } from './components'

moment.locale('fr')

type PageProps = {
  request: Request
  project: Project
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const NewModificationRequest = PageLayout(
  ({ request, project, cahiersChargesURLs }: PageProps) => {
    const { action, error, success, puissance, actionnaire, justification, delayInMonths } =
      (request.query as any) || {}

    const [displayForm, setDisplayForm] = useState(project.newRulesOptIn)
    const [disableSubmitButton, setDisableSubmitButton] = useState(false)

    const { appelOffre } = project

    return (
      <UserDashboard currentPage={'list-requests'}>
        <div className="panel">
          <div className="panel__header">
            <h3>
              <ModificationRequestActionTitles action={action} />
            </h3>
          </div>

          <form action={ROUTES.DEMANDE_ACTION} method="post" encType="multipart/form-data">
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="type" value={action} />
            <div className="form__group">
              <h4></h4>
              <div style={{ marginBottom: 5 }}>Concernant le projet:</div>
              <div
                className="text-quote"
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  marginBottom: 10,
                }}
              >
                <div {...dataId('modificationRequest-item-nomProjet')}>{project.nomProjet}</div>
                <div
                  style={{
                    fontStyle: 'italic',
                    lineHeight: 'normal',
                    fontSize: 12,
                  }}
                >
                  <div {...dataId('modificationRequest-item-nomCandidat')}>
                    {project.nomCandidat}
                  </div>
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
                  {project.puissance} {project.appelOffre?.unitePuissance}
                </div>
                <div>
                  Désigné le{' '}
                  <span {...dataId('modificationRequest-item-designationDate')}>
                    {formatDate(project.notifiedOn, 'DD/MM/YYYY')}
                  </span>{' '}
                  pour la période{' '}
                  <span {...dataId('modificationRequest-item-periode')}>{project.periodeId}</span>{' '}
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
                <div
                  className="notification success"
                  {...dataId('modificationRequest-successMessage')}
                >
                  {success}
                </div>
              ) : (
                ''
              )}
              <div>
                <label className="required">
                  <strong>
                    Veuillez saisir les modalités d'instruction à appliquer à ce changement
                  </strong>
                </label>
                <CDCChoiceForm
                  newRulesOptIn={project.newRulesOptIn}
                  cahiersChargesURLs={cahiersChargesURLs}
                  onChoiceChange={(isNewRule: boolean) => setDisplayForm(!isNewRule)}
                />
              </div>

              {displayForm && (
                <div {...dataId('modificationRequest-demandesInputs')}>
                  {action === 'puissance' && (
                    <ChangementPuissance
                      {...{
                        project,
                        puissance,
                        justification,
                        onPuissanceChecked: (isValid) => setDisableSubmitButton(!isValid),
                      }}
                    />
                  )}
                  {action === 'fournisseur' && (
                    <ChangementFournisseur {...{ project, justification }} />
                  )}
                  {action === 'producteur' ? (
                    <>
                      <label>Ancien producteur</label>
                      <input type="text" disabled defaultValue={project.nomCandidat} />
                      {appelOffre?.isSoumisAuxGFs && (
                        <div
                          className="notification warning"
                          style={{ marginTop: 10, marginBottom: 10 }}
                        >
                          <span>
                            Attention : de nouvelles garanties financières devront être déposées
                            d'ici un mois
                          </span>
                        </div>
                      )}
                      <label className="required" htmlFor="producteur">
                        Nouveau producteur
                      </label>
                      <input
                        type="text"
                        name="producteur"
                        id="producteur"
                        {...dataId('modificationRequest-producteurField')}
                      />
                      <label htmlFor="candidats">Statuts mis à jour</label>
                      <input
                        type="file"
                        name="file"
                        {...dataId('modificationRequest-fileField')}
                        id="file"
                      />
                      <label style={{ marginTop: 10 }} className="required" htmlFor="justification">
                        <strong>
                          Veuillez nous indiquer les raisons qui motivent cette modification
                        </strong>
                        <br />
                        Pour faciliter le traitement de votre demande, veillez à détailler les
                        raisons ayant conduit à ce besoin de modification (contexte, facteurs
                        extérieurs, etc)
                      </label>
                      <textarea
                        name="justification"
                        id="justification"
                        defaultValue={justification || ''}
                        {...dataId('modificationRequest-justificationField')}
                      />
                    </>
                  ) : (
                    ''
                  )}
                  {action === 'actionnaire' ? (
                    <>
                      <label>Ancien actionnaire</label>
                      <input type="text" disabled defaultValue={project.actionnaire} />
                      <label className="required" htmlFor="actionnaire">
                        Nouvel actionnaire
                      </label>
                      <input
                        type="text"
                        name="actionnaire"
                        id="actionnaire"
                        defaultValue={actionnaire || ''}
                        {...dataId('modificationRequest-actionnaireField')}
                      />
                      <label htmlFor="candidats">Statuts mis à jour</label>
                      <input
                        type="file"
                        name="file"
                        {...dataId('modificationRequest-fileField')}
                        id="file"
                      />
                      <label style={{ marginTop: 10 }} className="required" htmlFor="justification">
                        <strong>
                          Veuillez nous indiquer les raisons qui motivent cette modification
                        </strong>
                        <br />
                        Pour faciliter le traitement de votre demande, veillez à détailler les
                        raisons ayant conduit à ce besoin de modification (contexte, facteurs
                        extérieurs, etc)
                      </label>
                      <textarea
                        name="justification"
                        id="justification"
                        defaultValue={justification || ''}
                        {...dataId('modificationRequest-justificationField')}
                      />
                    </>
                  ) : (
                    ''
                  )}
                  {action === 'abandon' ? (
                    <>
                      <label className="required" htmlFor="justification">
                        <strong>
                          Veuillez nous indiquer les raisons qui motivent votre demande
                        </strong>
                        <br />
                        Pour faciliter le traitement de votre demande, veillez à détailler les
                        raisons ayant conduit à ce besoin de modification (contexte, facteurs
                        extérieurs, etc)
                      </label>
                      <textarea
                        name="justification"
                        id="justification"
                        defaultValue={justification || ''}
                        {...dataId('modificationRequest-justificationField')}
                      />
                      <label htmlFor="candidats">Pièce justificative</label>
                      <input
                        type="file"
                        name="file"
                        {...dataId('modificationRequest-fileField')}
                        id="file"
                      />
                    </>
                  ) : (
                    ''
                  )}
                  {action === 'recours' ? (
                    <>
                      <label className="required" htmlFor="justification">
                        <strong>
                          Veuillez nous indiquer les raisons qui motivent votre demande
                        </strong>
                        <br />
                        Pour faciliter le traitement de votre demande, veillez à détailler les
                        raisons ayant conduit à ce besoin de modification (contexte, facteurs
                        extérieurs, etc)
                      </label>
                      <textarea
                        name="justification"
                        id="justification"
                        defaultValue={justification || ''}
                        {...dataId('modificationRequest-justificationField')}
                      />
                      <label htmlFor="candidats">Pièce justificative (si nécessaire)</label>
                      <input
                        type="file"
                        name="file"
                        {...dataId('modificationRequest-fileField')}
                        id="file"
                      />
                    </>
                  ) : (
                    ''
                  )}
                  {action === 'delai' ? (
                    <>
                      <label>Date théorique de mise en service</label>
                      <input
                        type="text"
                        disabled
                        defaultValue={formatDate(
                          +moment(project.notifiedOn)
                            .add(
                              project.appelOffre &&
                                getDelaiDeRealisation(project.appelOffre, project.technologie),
                              'months'
                            )
                            .subtract(1, 'day'),
                          'DD/MM/YYYY'
                        )}
                        {...dataId('modificationRequest-presentServiceDateField')}
                      />
                      <label
                        style={{ marginTop: 5 }}
                        className="required"
                        htmlFor="delayedServiceDate"
                      >
                        Durée du délai en mois
                      </label>
                      <input
                        type="number"
                        name="delayInMonths"
                        id="delayInMonths"
                        defaultValue={delayInMonths}
                        data-initial-date={moment(project.notifiedOn)
                          .add(
                            project.appelOffre &&
                              getDelaiDeRealisation(project.appelOffre, project.technologie),
                            'months'
                          )
                          .toDate()
                          .getTime()}
                        {...dataId('delayInMonthsField')}
                      />
                      <div style={{ fontSize: 11 }} {...dataId('delayEstimateBox')}></div>
                      <label style={{ marginTop: 10 }} className="required" htmlFor="justification">
                        <strong>
                          Veuillez nous indiquer les raisons qui motivent votre demande
                        </strong>
                        <br />
                        Pour faciliter le traitement de votre demande, veillez à détailler les
                        raisons ayant conduit à ce besoin de modification (contexte, facteurs
                        extérieurs, etc)
                      </label>
                      <textarea
                        name="justification"
                        id="justification"
                        defaultValue={justification || ''}
                        {...dataId('modificationRequest-justificationField')}
                      />
                      {!(project.dcrNumeroDossier || project.numeroGestionnaire) ? (
                        <>
                          <label htmlFor="numeroGestionnaire" style={{ marginTop: 5 }}>
                            Identifiant gestionnaire de réseau
                          </label>
                          <div style={{ fontSize: 11 }}>
                            Cette indication permettra un traitement plus rapide de votre demande.{' '}
                            <a href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
                              Où trouver mon numéro ?
                            </a>
                          </div>
                          <input
                            type="text"
                            name="numeroGestionnaire"
                            {...dataId('modificationRequest-numeroGestionnaireField')}
                            id="numeroGestionnaire"
                          />
                        </>
                      ) : null}
                      <label htmlFor="file" style={{ marginTop: 5 }}>
                        Pièce justificative (si nécessaire)
                      </label>
                      <input
                        type="file"
                        name="file"
                        {...dataId('modificationRequest-fileField')}
                        id="file"
                      />
                    </>
                  ) : (
                    ''
                  )}

                  <button
                    className="button"
                    type="submit"
                    name="submit"
                    id="submit"
                    {...dataId('submit-button')}
                    disabled={disableSubmitButton}
                  >
                    Envoyer
                  </button>
                  <a
                    className="button-outline primary"
                    {...dataId('cancel-button')}
                    href={ROUTES.USER_LIST_PROJECTS}
                  >
                    Annuler
                  </a>
                </div>
              )}
            </div>
          </form>
        </div>
      </UserDashboard>
    )
  }
)

hydrateOnClient(NewModificationRequest)
