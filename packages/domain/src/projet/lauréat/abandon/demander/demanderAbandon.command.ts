import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { PiéceJustificativeAbandon } from '../abandon.valueType';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { AbandonDemandéEvent } from '../abandon.event';
import { EnregistrerPiéceJustificativeAbandonPort } from '../abandon.port';
import { DateTimeValueType } from '../../../../common.valueType';
import { AbandonDéjàAccordéError, DemandeAbandonEnCoursErreur } from '../abandon.error';
import { IdentifiantUtilisateurValueType } from '../../../../utilisateur/utilisateur.valueType';

export type DemanderAbandonCommand = Message<
  'DEMANDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    raison: string;
    piéceJustificative?: PiéceJustificativeAbandon;
    dateDemandeAbandon: DateTimeValueType;
    recandidature: boolean;
    demandéPar: IdentifiantUtilisateurValueType;
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

    if (piéceJustificative) {
      await enregistrerPiéceJustificativeAbandon({
        identifiantProjet,
        piéceJustificative,
        datePiéceJustificativeAbandon: dateDemandeAbandon,
      });
    }

    const event: AbandonDemandéEvent = {
      type: 'AbandonDemandé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        recandidature,
        piéceJustificative: piéceJustificative && {
          format: piéceJustificative.format,
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
