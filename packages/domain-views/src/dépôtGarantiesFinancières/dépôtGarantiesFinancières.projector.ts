import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, isSome } from '@potentiel/monads';
import {
  DépôtGarantiesFinancièresReadModel,
  DépôtGarantiesFinancièresReadModelKey,
} from './dépôtGarantiesFinancières.readModel';
import {
  DépôtGarantiesFinancièresEvent,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import {
  GarantiesFinancièresReadModel,
  GarantiesFinancièresReadModelKey,
} from '../domainViews.readModel';
import { Create, Update, Find, Remove } from '@potentiel/core-domain';
import { RécupérerDétailProjetPort } from '../domainViews.port';

export type ExecuteDépôtGarantiesFinancièresProjector = Message<
  'EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR',
  DépôtGarantiesFinancièresEvent
>;

export type DépôtGarantiesFinancièresProjectorDependencies = {
  create: Create;
  update: Update;
  find: Find;
  remove: Remove;
  récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerDépôtGarantiesFinancièresProjector = ({
  create,
  update,
  find,
  remove,
  récupérerDétailProjet,
}: DépôtGarantiesFinancièresProjectorDependencies) => {
  const handler: MessageHandler<ExecuteDépôtGarantiesFinancièresProjector> = async (event) => {
    const dépôtReadModelKey: DépôtGarantiesFinancièresReadModelKey = `dépôt-garanties-financières|${event.payload.identifiantProjet}`;
    const dépôtGarantiesFinancières = await find<DépôtGarantiesFinancièresReadModel>(
      dépôtReadModelKey,
    );

    const getRégionsProjet = async (identifiantProjet: RawIdentifiantProjet) => {
      const projet = await récupérerDétailProjet(convertirEnIdentifiantProjet(identifiantProjet));
      if (isSome(projet)) {
        return projet.localité.région;
      } else {
        // TODO: logger error
        return 'REGION INCONNUE';
      }
    };

    switch (event.type) {
      case 'GarantiesFinancièresSnapshot-v1':
        if (!event.payload.aggregate.dépôt) {
          return;
        }
        if (isNone(dépôtGarantiesFinancières)) {
          const { typeGarantiesFinancières, dateÉchéance, attestationConstitution, dateDépôt } =
            event.payload.aggregate.dépôt;
          const région = await getRégionsProjet(event.payload.identifiantProjet);
          await create<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey, {
            typeGarantiesFinancières,
            dateÉchéance,
            attestationConstitution,
            dateDépôt,
            dateDernièreMiseÀJour: dateDépôt,
            région,
            identifiantProjet: event.payload.identifiantProjet,
          });
        } else {
          // TODO: logger error
        }
        break;
      case 'GarantiesFinancièresDéposées-v1':
        const région = await getRégionsProjet(event.payload.identifiantProjet);
        if (isSome(dépôtGarantiesFinancières)) {
          await update<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey, {
            typeGarantiesFinancières:
              'typeGarantiesFinancières' in event.payload
                ? event.payload.typeGarantiesFinancières
                : undefined,
            dateÉchéance: 'dateÉchéance' in event.payload ? event.payload.dateÉchéance : undefined,
            attestationConstitution: {
              format: event.payload.attestationConstitution.format,
              date: event.payload.attestationConstitution.date,
            },
            dateDépôt: event.payload.dateDépôt,
            dateDernièreMiseÀJour: event.payload.dateDépôt,
            région,
            identifiantProjet: event.payload.identifiantProjet,
          });
          break;
        }
        await create<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey, {
          typeGarantiesFinancières:
            'typeGarantiesFinancières' in event.payload
              ? event.payload.typeGarantiesFinancières
              : undefined,
          dateÉchéance: 'dateÉchéance' in event.payload ? event.payload.dateÉchéance : undefined,
          attestationConstitution: {
            format: event.payload.attestationConstitution.format,
            date: event.payload.attestationConstitution.date,
          },
          dateDépôt: event.payload.dateDépôt,
          dateDernièreMiseÀJour: event.payload.dateDépôt,
          région,
          identifiantProjet: event.payload.identifiantProjet,
        });
        break;
      case 'DépôtGarantiesFinancièresModifié-v1':
        if (isNone(dépôtGarantiesFinancières)) {
          // ne devrait pas arriver
          break;
        }
        await update<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey, {
          ...dépôtGarantiesFinancières,
          typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
          dateÉchéance: 'dateÉchéance' in event.payload ? event.payload.dateÉchéance : undefined,
          attestationConstitution: {
            format: event.payload.attestationConstitution.format,
            date: event.payload.attestationConstitution.date,
          },
          dateDernièreMiseÀJour: event.payload.dateModification,
        });
        break;
      case 'DépôtGarantiesFinancièresValidé-v1':
        // enregistrer GF
        const garantiesFinancièresActuellesKey: GarantiesFinancièresReadModelKey = `garanties-financières|${event.payload.identifiantProjet}`;
        const garantiesFinancièresActuelles = await find<GarantiesFinancièresReadModel>(
          garantiesFinancièresActuellesKey,
        );

        if (isSome(dépôtGarantiesFinancières)) {
          const garantiesFinancières = {
            typeGarantiesFinancières: dépôtGarantiesFinancières.typeGarantiesFinancières,
            dateÉchéance: dépôtGarantiesFinancières.dateÉchéance,
            attestationConstitution: {
              format: dépôtGarantiesFinancières.attestationConstitution.format,
              date: dépôtGarantiesFinancières.attestationConstitution.date,
            },
          };
          if (isSome(garantiesFinancièresActuelles)) {
            await update<GarantiesFinancièresReadModel>(
              garantiesFinancièresActuellesKey,
              garantiesFinancières,
            );
          } else {
            await create<GarantiesFinancièresReadModel>(
              garantiesFinancièresActuellesKey,
              garantiesFinancières,
            );
          }
        } else {
          // TODO: logger error
        }

        await remove<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey);
      case 'DépôtGarantiesFinancièresSupprimé-v1':
        await remove<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey);
        break;
    }
  };

  mediator.register('EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR', handler);
};
