import { Message, MessageHandler, mediator } from 'mediateur';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { isSome } from '@potentiel/monads';
import { AbandonDemandéEvent } from '../abandon.event';
import { EnregistrerPièceJustificativeAbandonPort } from '../abandon.port';
import { AbandonDéjàAccordéError, AbandonEnCoursErreur } from '../abandon.error';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { PièceJustificativeAbandonValueType } from '../pièceJustificativeAbandon.valueType';

export type DemanderAbandonCommand = Message<
  'DEMANDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    pièceJustificative?: PièceJustificativeAbandonValueType;
    dateDemandeAbandon: DateTime.ValueType;
    recandidature: boolean;
    demandéPar: IdentifiantUtilisateur.ValueType;
  }
>;

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
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate });
  const handler: MessageHandler<DemanderAbandonCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    dateDemandeAbandon,
    recandidature,
    demandéPar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isSome(abandon)) {
      if (abandon.estAccordé()) {
        throw new AbandonDéjàAccordéError();
      }

      if (abandon.estEnCours()) {
        throw new AbandonEnCoursErreur();
      }
    }

    if (pièceJustificative) {
      await enregistrerPièceJustificativeAbandon({
        identifiantProjet,
        pièceJustificative,
        datePièceJustificativeAbandon: dateDemandeAbandon,
      });
    }

    const event: AbandonDemandéEvent = {
      type: 'AbandonDemandé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        recandidature,
        pièceJustificative: pièceJustificative && {
          format: pièceJustificative.format,
        },
        raison,
        demandéLe: dateDemandeAbandon.formatter(),
        demandéPar: demandéPar.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('DEMANDER_ABANDON_COMMAND', handler);
};
