import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { PiéceJustificativeAbandon } from '../abandon.valueType';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { AbandonDemandéEvent } from '../abandon.event';
import { EnregistrerPiéceJustificativeAbandonPort } from '../abandon.port';
import { DateTimeValueType } from '../../../../common.valueType';
import { DemandeAbandonEnCoursErreur } from '../abandon.error';

export type DemanderAbandonCommand = Message<
  'DEMANDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    raison: string;
    piéceJustificative: PiéceJustificativeAbandon;
    dateDemandeAbandon: DateTimeValueType;
    recandidature: boolean;
  }
>;

export type DemanderAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerPiéceJustificativeAbandon: EnregistrerPiéceJustificativeAbandonPort;
};

export const registerDemanderAbandonCommand = ({
  loadAggregate,
  publish,
  enregistrerPiéceJustificativeAbandon,
}: DemanderAbandonDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate });
  const handler: MessageHandler<DemanderAbandonCommand> = async ({
    identifiantProjet,
    piéceJustificative,
    raison,
    dateDemandeAbandon,
    recandidature,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isSome(abandon)) {
      throw new DemandeAbandonEnCoursErreur();
    }

    await enregistrerPiéceJustificativeAbandon({
      identifiantProjet,
      piéceJustificative,
      datePiéceJustificativeAbandon: dateDemandeAbandon,
    });

    const event: AbandonDemandéEvent = {
      type: 'AbandonDemandé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        recandidature,
        piéceJustificative: {
          format: piéceJustificative.format,
        },
        raison,
        demandéLe: dateDemandeAbandon.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('DEMANDER_ABANDON_COMMAND', handler);
};
