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

export type DemanderAbandonAvecRecandidatureCommand = Message<
  'DEMANDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    raison: string;
    piéceJustificative: PiéceJustificativeAbandon;
    dateAbandon: DateTimeValueType;
    recandidature: boolean;
  }
>;

export type DemanderAbandonAvecRecandidatureDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerPiéceJustificativeAbandon: EnregistrerPiéceJustificativeAbandonPort;
};

export const registerDemanderAbandonAvecRecandidatureCommand = ({
  loadAggregate,
  publish,
  enregistrerPiéceJustificativeAbandon,
}: DemanderAbandonAvecRecandidatureDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate });
  const handler: MessageHandler<DemanderAbandonAvecRecandidatureCommand> = async ({
    identifiantProjet,
    piéceJustificative,
    raison,
    dateAbandon,
    recandidature,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isSome(abandon)) {
      throw new DemandeAbandonEnCoursErreur();
    }

    await enregistrerPiéceJustificativeAbandon({
      identifiantProjet: identifiantProjet.formatter(),
      piéceJustificative,
    });

    const event: AbandonDemandéEvent = {
      type: 'AbandonDemandé',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        recandidature,
        piéceJustificative: {
          format: piéceJustificative.format,
        },
        raison,
        dateAbandon: dateAbandon.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('DEMANDER_ABANDON_COMMAND', handler);
};
