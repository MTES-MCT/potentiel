import { ChangementDePuissanceAccordé } from '@modules/demandeModification'
import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { ModificationRequest } from '../ModificationRequest'
import { ModificationRequestAccepted } from '../events'

type MakeOnChangementDePuissanceAccordéProps = {
  modificationRequestRepo: TransactionalRepository<ModificationRequest>
  publishToEventStore: EventStore['publish']
}

type OnChangementDePuissanceAccordéProps = ChangementDePuissanceAccordé

export const makeOnChangementDePuissanceAccordé =
  ({ modificationRequestRepo, publishToEventStore }: MakeOnChangementDePuissanceAccordéProps) =>
  ({
    payload: {
      projetId: projectId,
      accordéPar: acceptedBy,
      nouvellePuissance,
      demandeId,
      isDecisionJustice,
      fichierRéponseId,
    },
  }: OnChangementDePuissanceAccordéProps) =>
    modificationRequestRepo.transaction(new UniqueEntityID(projectId), () =>
      publishToEventStore(
        new ModificationRequestAccepted({
          payload: {
            modificationRequestId: demandeId.toString(),
            params: {
              type: 'puissance',
              newPuissance: nouvellePuissance,
              isDecisionJustice,
            },
            acceptedBy,
            responseFileId: fichierRéponseId || '',
          },
        })
      )
    )
