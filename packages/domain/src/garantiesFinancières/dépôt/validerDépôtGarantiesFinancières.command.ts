import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  createGarantiesFinancièresAggregateId,
  loadGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';
import { DéplacerFichierPort } from '../../common.ports';
import { isNone } from '@potentiel/monads';
import { DépôtGarantiesFinancièresNonTrouvéPourValidationErreur } from '../garantiesFinancières.error';
import { DépôtGarantiesFinancièresValidéEventV1 } from './dépôtGarantiesFinancières.event';

export type ValiderDépôtGarantiesFinancièresCommand = Message<
  'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
  }
>;

export type ValiderDépôtarantiesFinancièresDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  déplacerFichier: DéplacerFichierPort;
};

export const registerValiderDépôtGarantiesFinancièresCommand = ({
  publish,
  loadAggregate,
  déplacerFichier,
}: ValiderDépôtarantiesFinancièresDependencies) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<ValiderDépôtGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);

    if (isNone(agrégatGarantiesFinancières) || !agrégatGarantiesFinancières.dépôt) {
      throw new DépôtGarantiesFinancièresNonTrouvéPourValidationErreur();
    }

    await déplacerFichier({
      identifiantProjet: identifiantProjet.formatter(),
      typeFichierActuel: 'depot-attestation-constitution-garanties-financieres',
      nouveauType: 'attestation-constitution-garanties-financieres',
    });

    const event: DépôtGarantiesFinancièresValidéEventV1 = {
      type: 'DépôtGarantiesFinancièresValidé-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await publish(createGarantiesFinancièresAggregateId(identifiantProjet), event);
  };

  mediator.register('VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES', handler);
};
