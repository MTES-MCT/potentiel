import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { PiéceJustificativeAbandon } from '../abandon.valueType';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { AbandonDemandéEvent } from '../abandon.event';
import { EnregistrerPiéceJustificativeAbandonPort } from '../abandon.port';

export type DemanderAbandonAvecRecandidatureCommand = Message<
  'DEMANDER_ABANDON_AVEC_RECANDIDATURE_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    raison: string;
    piéceJustificative: PiéceJustificativeAbandon;
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
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isSome(abandon)) {
      throw new Error(`Une demande d'abandon existe déjà pour le projet`);
    }

    await enregistrerPiéceJustificativeAbandon({
      identifiantProjet: identifiantProjet.formatter(),
      piéceJustificative,
    });

    const event: AbandonDemandéEvent = {
      type: 'AbandonDemandé',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        avecRecandidature: true,
        piéceJustificative,
        raison,
        dateAbandon: new Date().toISOString(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('DEMANDER_ABANDON_AVEC_RECANDIDATURE_COMMAND', handler);
};
