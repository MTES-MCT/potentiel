import { Message, MessageHandler, mediator } from 'mediateur';
import { ProjetEvent } from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import { ProjetReadModel, ProjetReadModelKey } from './projet.readModel';
import { Create, Update, Find } from '../common.port';

export type ExecuteProjetProjector = Message<'EXECUTE_PROJET_PROJECTOR', ProjetEvent>;

export type ProjetProjectorDependencies = {
  create: Create;
  update: Update;
  find: Find;
};

export const registerProjetProjector = ({ create, update, find }: ProjetProjectorDependencies) => {
  const handler: MessageHandler<ExecuteProjetProjector> = async (event) => {
    const key: ProjetReadModelKey = `projet|${
      event.payload.identifiantProjet as `${string}#${string}#${string}#${string}`
    }`;
    const projet = await find<ProjetReadModel>(key);
    switch (event.type) {
      case 'GestionnaireRéseauProjetDéclaré':
        if (isNone(projet)) {
          await create<ProjetReadModel>(key, {
            identifiantGestionnaire: {
              codeEIC: event.payload.identifiantGestionnaireRéseau,
            },
          });
        } else {
          await update<ProjetReadModel>(key, {
            ...projet,
            identifiantGestionnaire: {
              codeEIC: event.payload.identifiantGestionnaireRéseau,
            },
          });
        }
        break;
      case 'GestionnaireRéseauProjetModifié':
        if (isNone(projet)) {
          await create<ProjetReadModel>(key, {
            identifiantGestionnaire: {
              codeEIC: event.payload.identifiantGestionnaireRéseau,
            },
          });
        } else {
          await update<ProjetReadModel>(key, {
            ...projet,
            identifiantGestionnaire: {
              codeEIC: event.payload.identifiantGestionnaireRéseau,
            },
          });
        }
        break;
      // case 'TypeGarantiesFinancièresEnregistré':
      //   if (isNone(projet)) {
      //     await create<ProjetReadModel>(key, {
      //       garantiesFinancières: {
      //         type: event.payload.type,
      //         dateÉchéance: event.payload.dateÉchéance,
      //       },
      //     });
      //   } else {
      //     await update<ProjetReadModel>(key, {
      //       ...projet,
      //       garantiesFinancières: {
      //         ...projet.garantiesFinancières,
      //         type: event.payload.type,
      //         dateÉchéance: event.payload.dateÉchéance,
      //       },
      //     });
      //   }
      //   break;
      // case 'AttestationGarantiesFinancièresEnregistrée':
      //   if (isNone(projet)) {
      //     await create<ProjetReadModel>(key, {
      //       garantiesFinancières: {
      //         attestation: {
      //           format: event.payload.format,
      //           dateConstitution: event.payload.dateConstitution,
      //         },
      //       },
      //     });
      //   } else {
      //     await update<ProjetReadModel>(key, {
      //       ...projet,
      //       garantiesFinancières: {
      //         ...projet.garantiesFinancières,
      //         attestation: {
      //           format: event.payload.format,
      //           dateConstitution: event.payload.dateConstitution,
      //         },
      //       },
      //     });
      //   }
      //   break;
    }
  };

  mediator.register('EXECUTE_PROJET_PROJECTOR', handler);
};
