import {
  Button,
  ErrorBox,
  ModificationRequestActionTitles,
  PageLayout,
  ProjectInfo,
  RoleBasedDashboard,
  SuccessBox,
} from '@components'
import {
  AdminResponseForm,
  DemandeDetails,
  DemandeStatus,
} from '../modificationRequestPage/components'
import ROUTES from '@routes'
import React from 'react'
import { Request } from 'express'
import { DemandeAbandonPageDTO } from '@modules/modificationRequest'
import moment from 'moment'
import { dataId } from '../../../helpers/testId'

type DemandeAbandonProps = {
  request: Request
  modificationRequest: DemandeAbandonPageDTO
}

moment.locale('fr')

export const DemandeAbandon = PageLayout(
  ({ request, modificationRequest }: DemandeAbandonProps) => {
    const { user } = request
    const { error, success } = request.query as any
    const { type, id, status } = modificationRequest

    const isAdmin = ['admin', 'dgec', 'dreal'].includes(user.role)

    const showFormulaireAdministrateur =
      isAdmin &&
      !modificationRequest.respondedOn &&
      !modificationRequest.cancelledOn &&
      status !== 'information validée'

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
          <ProjectInfo project={modificationRequest.project} className="mb-3" />
          <ErrorBox error={error} />
          <SuccessBox success={success} />
          <div className="panel__header">
            <DemandeStatus role={user.role} modificationRequest={modificationRequest} />
          </div>
          {showFormulaireAdministrateur && (
            <div className="panel__header">
              <h4>Répondre</h4>
              <AdminResponseForm role={user.role} modificationRequest={modificationRequest}>
                {!['en attente de confirmation', 'demande confirmée'].includes(
                  modificationRequest.status
                ) && (
                  <Button
                    primary
                    type="submit"
                    name="submitConfirm"
                    {...dataId('ask-confirmation-button')}
                    className="mt-2"
                  >
                    Demander une confirmation au porteur de projet
                  </Button>
                )}
              </AdminResponseForm>
            </div>
          )}
          {!isAdmin &&
            ['envoyée', 'en instruction', 'en attente de confirmation'].includes(status) && (
              <form
                action={ROUTES.ANNULER_DEMANDE_ABANDON_ACTION}
                method="post"
                style={{ margin: 0 }}
              >
                <input type="hidden" name="modificationRequestId" value={id} />

                <button
                  className="button-outline warning"
                  type="submit"
                  name="submit"
                  data-confirm={`Etes-vous sur de vouloir annuler cette demande ?`}
                >
                  Annuler la demande
                </button>
              </form>
            )}
        </div>
      </RoleBasedDashboard>
    )
  }
)
