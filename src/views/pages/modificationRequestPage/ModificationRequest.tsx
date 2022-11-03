import {
  ErrorBox,
  ModificationRequestActionTitles,
  ProjectInfo,
  SuccessBox,
  SecondaryButton,
  PageTemplate,
} from '@components'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { userIs } from '@modules/users'
import ROUTES from '@routes'
import { Request } from 'express'
import moment from 'moment'
import React from 'react'
import { hydrateOnClient } from '../../helpers'
import {
  ActionnaireForm,
  AdminResponseForm,
  AdminRéponseDélaiForm,
  AnnulerDemandeDélaiBouton,
  CancelButton,
  DemandeDetails,
  DemandeStatus,
  ProducteurForm,
  PuissanceForm,
  RecoursForm,
} from './components'

moment.locale('fr')

type ModificationRequestProps = {
  request: Request
  modificationRequest: ModificationRequestPageDTO
}

export const ModificationRequest = ({ request, modificationRequest }: ModificationRequestProps) => {
  const { user } = request
  const { error, success } = request.query as any
  const { type, id, status } = modificationRequest

  const userIsAdmin = userIs(['admin', 'dgec-validateur', 'dreal'])(user)

  const showFormulaireAdministrateur =
    userIsAdmin &&
    !modificationRequest.respondedOn &&
    !modificationRequest.cancelledOn &&
    status !== 'information validée'

  const showPasserEnInstructionButton =
    showFormulaireAdministrateur && type === 'delai' && status === 'envoyée'

  return (
    <PageTemplate user={request.user} currentPage="list-requests">
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
          {showPasserEnInstructionButton && (
            <form
              method="post"
              action={ROUTES.ADMIN_PASSER_DEMANDE_DELAI_EN_INSTRUCTION({
                modificationRequestId: modificationRequest.id,
              })}
              className="m-0"
            >
              <SecondaryButton
                type="submit"
                name="modificationRequestId"
                value={modificationRequest.id}
                onClick={(e) => {
                  if (
                    !confirm(
                      'Êtes-vous sûr de vouloir passer le statut de la demande "en instruction" ?'
                    )
                  ) {
                    e.preventDefault()
                  }
                }}
              >
                Passer en instruction
              </SecondaryButton>
            </form>
          )}
        </div>

        {showFormulaireAdministrateur && (
          <div className="panel__header">
            <h4>Répondre</h4>

            <AdminResponseForm role={user.role} modificationRequest={modificationRequest}>
              {type === 'delai' && (
                <AdminRéponseDélaiForm modificationRequest={modificationRequest} />
              )}

              {type === 'recours' && <RecoursForm />}

              {type === 'puissance' && <PuissanceForm modificationRequest={modificationRequest} />}

              {type === 'actionnaire' && (
                <ActionnaireForm modificationRequest={modificationRequest} />
              )}
              {type === 'producteur' && (
                <ProducteurForm modificationRequest={modificationRequest} />
              )}
            </AdminResponseForm>
          </div>
        )}

        {userIs('porteur-projet')(user) &&
          (type === 'delai' ? (
            <AnnulerDemandeDélaiBouton
              status={status}
              id={id}
              route={
                modificationRequest.delayInMonths
                  ? ROUTES.ANNULER_DEMANDE_ACTION
                  : ROUTES.ANNULER_DEMANDE_DELAI
              }
            />
          ) : (
            <CancelButton status={status} id={id} />
          ))}
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(ModificationRequest)
