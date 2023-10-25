import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { PièceJustificativeAbandon } from '../abandon.valueType';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { AbandonDemandéEvent } from '../abandon.event';
import { EnregistrerPièceJustificativeAbandonPort } from '../abandon.port';
import { DateTimeValueType } from '../../../../common/common.valueType';
import { AbandonDéjàAccordéError, DemandeAbandonEnCoursErreur } from '../abandon.error';
import { IdentifiantUtilisateurValueType } from '../../../../utilisateur/utilisateur.valueType';

export type DemanderAbandonCommand = Message<
  'DEMANDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    raison: string;
    pièceJustificative?: PièceJustificativeAbandon;
    dateDemandeAbandon: DateTimeValueType;
    recandidature: boolean;
    demandéPar: IdentifiantUtilisateurValueType;
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
        throw new DemandeAbandonEnCoursErreur();
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
