import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';

import { PièceJustificativeAbandonValueType } from '../pièceJustificativeAbandon.valueType';
import { loadAbandonAggregateFactory } from '../abandon.aggregate';

export type DemanderAbandonCommand = Message<
  'DEMANDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    pièceJustificative?: PièceJustificativeAbandonValueType;
    recandidature: boolean;
    demandéPar: IdentifiantUtilisateur.ValueType;
  }
>;

export type EnregistrerPièceJustificativeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjet.ValueType;
  pièceJustificative: PièceJustificativeAbandonValueType;
  datePièceJustificativeAbandon: DateTime.ValueType;
}) => Promise<void>;

export type DemanderAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerPièceJustificativeAbandon: EnregistrerPièceJustificativeAbandonPort;
};

export const registerDemanderAbandonCommand = ({
  loadAggregate,
  publish,
  enregistrerPièceJustificativeAbandon,
}: DemanderAbandonDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate, publish });
  const handler: MessageHandler<DemanderAbandonCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    recandidature,
    demandéPar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet, false);

    await abandon.demander({
      identifiantProjet,
      pièceJustificative,
      raison,
      demandéPar,
      recandidature,
    });

    if (pièceJustificative) {
      await enregistrerPièceJustificativeAbandon({
        identifiantProjet,
        pièceJustificative,
        datePièceJustificativeAbandon: abandon.demande.demandéLe,
      });
    }
  };
  mediator.register('DEMANDER_ABANDON_COMMAND', handler);
};
