import { Request } from 'express'
import moment from 'moment'
import React from 'react'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { ErrorBox, PageLayout, ProjectInfo, RoleBasedDashboard, SuccessBox } from '../../components'
import ModificationRequestActionTitles from '../../components/ModificationRequestActionTitles'
import {
  AdminResponseForm,
  DelaiForm,
  DemandeDetails,
  DemandeStatus,
  RecoursForm,
  AbandonForm,
  CancelButton,
  ActionnaireForm,
  PuissanceForm,
  ProducteurForm,
  AnnulerDemandeDélaiBouton,
} from './components'
import { hydrateOnClient } from '../../helpers'

moment.locale('fr')

type ModificationRequestProps = {
  request: Request
  modificationRequest: ModificationRequestPageDTO
}

export const ModificationRequest = PageLayout(
  ({ request, modificationRequest }: ModificationRequestProps) => {
    const { user } = request
    const { error, success } = request.query as any
    const { type, id, status, project } = modificationRequest

    const isAdmin = ['admin', 'dgec', 'dreal'].includes(user.role)

    return (
      <RoleBasedDashboard role={user.role} currentPage={'list-requests'}>
        <div className="panel">
          <div className="panel__header" style={{ position: 'relative' }}>
            <h3>
              <ModificationRequestActionTitles action={type} />
            </h3>
          </div>

          <DemandeDetails modificationRequest={modificationRequest} />

          <p className="m-0">Concernant le projet :</p>
          <ProjectInfo project={modificationRequest.project} className="mb-3"></ProjectInfo>

          <ErrorBox error={error} />
          <SuccessBox success={success} />

          <div className="panel__header">
            <DemandeStatus role={user.role} modificationRequest={modificationRequest} />
          </div>

          {isAdmin &&
            !modificationRequest.respondedOn &&
            !modificationRequest.cancelledOn &&
            modificationRequest.status !== 'information validée' && (
              <div className="panel__header">
                <h4>Répondre</h4>

                <AdminResponseForm role={user.role} modificationRequest={modificationRequest}>
                  {type === 'delai' && <DelaiForm modificationRequest={modificationRequest} />}

                  {type === 'recours' && <RecoursForm />}

                  {type === 'abandon' && <AbandonForm modificationRequest={modificationRequest} />}

                  {type === 'puissance' && (
                    <PuissanceForm modificationRequest={modificationRequest} />
                  )}

                  {type === 'actionnaire' && (
                    <ActionnaireForm modificationRequest={modificationRequest} />
                  )}
                  {type === 'producteur' && (
                    <ProducteurForm modificationRequest={modificationRequest} />
                  )}
                </AdminResponseForm>
              </div>
            )}

          {type === 'delai' ? (
            <AnnulerDemandeDélaiBouton
              status={status}
              id={id}
              isAdmin={isAdmin}
              projectId={project.id}
              hasDelayInMonths={!!modificationRequest.delayInMonths}
              route={
                modificationRequest.delayInMonths
                  ? 'ROUTES.ANNULER_DEMANDE_ACTION'
                  : 'ROUTES.ANNULER_DEMANDE_DELAI'
              }
            />
          ) : (
            <CancelButton status={status} id={id} isAdmin={isAdmin} />
          )}
        </div>
      </RoleBasedDashboard>
    )
  }
)

hydrateOnClient(ModificationRequest)
