import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DateTimeValueType } from '../../../../common/common.valueType';
import { AbandonAnnuléEvent } from '../abandon.event';
import { AbandonDéjàAccordéError, DemandeAbandonInconnuErreur } from '../abandon.error';
import { IdentifiantUtilisateurValueType } from '../../../../domain.valueType';

export type AnnulerAbandonCommand = Message<
  'ANNULER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    dateAnnulationAbandon: DateTimeValueType;
    annuléPar: IdentifiantUtilisateurValueType;
  }
>;

export type AnnulerAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerAnnulerAbandonCommand = ({
  loadAggregate,
  publish,
}: AnnulerAbandonDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate });
  const handler: MessageHandler<AnnulerAbandonCommand> = async ({
    identifiantProjet,
    dateAnnulationAbandon,
    annuléPar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isNone(abandon)) {
      throw new DemandeAbandonInconnuErreur();
    }

    if (abandon.estAccordé()) {
      throw new AbandonDéjàAccordéError();
    }

    const event: AbandonAnnuléEvent = {
      type: 'AbandonAnnulé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        annuléLe: dateAnnulationAbandon.formatter(),
        annuléPar: annuléPar.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('ANNULER_ABANDON_COMMAND', handler);
};
