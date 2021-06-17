import { Request } from 'express'
import moment from 'moment'
import React from 'react'
import { logger } from '../../../core/utils'
import { ModificationRequestPageDTO } from '../../../modules/modificationRequest'
import { ErrorBox, RoleBasedDashboard, SuccessBox } from '../../components'
import {
  AdminResponseForm,
  DelaiForm,
  DemandeDetails,
  DemandeStatus,
  ProjectDetails,
  RecoursForm,
  AbandonForm,
  CancelButton,
} from './components'
import { PuissanceForm } from './components/PuissanceForm'

moment.locale('fr')

interface PageProps {
  request: Request
  modificationRequest: ModificationRequestPageDTO
}

/* Pure component */
export default function AdminModificationRequestPage({ request, modificationRequest }: PageProps) {
  const { user } = request
  const { error, success } = request.query as any
  const { type, id, status } = modificationRequest

  if (!user) {
    // Should never happen
    logger.error('Try to render ProjectDetails without a user')
    return <div />
  }
  const isResponsePossible = ['recours', 'delai', 'abandon', 'puissance'].includes(type)

  const isAdmin = ['admin', 'dgec', 'dreal'].includes(user.role)

  const titlePerAction = {
    delai: 'Je demande un délai supplémentaire',
    actionnaire: "Je signale un changement d'actionnaire",
    fournisseur: 'Je signale un changement de fournisseur',
    puissance: 'Je signale un changement de puissance',
    producteur: 'Je signale un changement de producteur',
    abandon: 'Je demande un abandon de mon projet',
    recours: 'Je demande un recours',
  }

  return (
    <RoleBasedDashboard role={user.role} currentPage={'list-requests'}>
      <div className="panel">
        <div className="panel__header" style={{ position: 'relative' }}>
          <h3>{titlePerAction[type]}</h3>
        </div>

        <DemandeDetails modificationRequest={modificationRequest} />

        <ProjectDetails modificationRequest={modificationRequest} />

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

              <AdminResponseForm modificationRequest={modificationRequest}>
                {isResponsePossible && (
                  <>
                    {modificationRequest.type === 'delai' && (
                      <DelaiForm modificationRequest={modificationRequest} />
                    )}

                    {modificationRequest.type === 'recours' && (
                      <RecoursForm modificationRequest={modificationRequest} />
                    )}

                    {modificationRequest.type === 'abandon' && (
                      <AbandonForm modificationRequest={modificationRequest} />
                    )}

                    {modificationRequest.type === 'puissance' && (
                      <PuissanceForm modificationRequest={modificationRequest} />
                    )}
                  </>
                )}
              </AdminResponseForm>
            </div>
          )}

        <CancelButton status={status} id={id} isAdmin={isAdmin} />
      </div>
    </RoleBasedDashboard>
  )
}
