import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  createGarantiesFinancièresAggregateId,
  loadGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';
import { SupprimerFichierPort } from '../../common.ports';
import { isNone } from '@potentiel/monads';
import { DépôtGarantiesFinancièresNonTrouvéPourValidationErreur } from '../garantiesFinancières.error';
import { DépôtGarantiesFinancièresSuppriméEventV1 } from './dépôtGarantiesFinancières.event';

export type SupprimerDépôtGarantiesFinancièresCommand = Message<
  'SUPPRIMER_DÉPÔT_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
  }
>;

export type SupprimerDépôtGarantiesFinancièresDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  supprimerFichier: SupprimerFichierPort;
};

export const registerSupprimerDépôtGarantiesFinancièresCommand = ({
  publish,
  loadAggregate,
  supprimerFichier,
}: SupprimerDépôtGarantiesFinancièresDependencies) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<SupprimerDépôtGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);

    if (isNone(agrégatGarantiesFinancières) || !agrégatGarantiesFinancières.dépôt) {
      throw new DépôtGarantiesFinancièresNonTrouvéPourValidationErreur();
    }

    await supprimerFichier({
      type: 'depot-attestation-constitution-garanties-financieres',
      identifiantProjet: identifiantProjet.formatter(),
    });

    const event: DépôtGarantiesFinancièresSuppriméEventV1 = {
      type: 'DépôtGarantiesFinancièresSupprimé-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await publish(createGarantiesFinancièresAggregateId(identifiantProjet), event);
  };

  mediator.register('SUPPRIMER_DÉPÔT_GARANTIES_FINANCIÈRES', handler);
};
