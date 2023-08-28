import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, isSome } from '@potentiel/monads';
import {
  DépôtGarantiesFinancièresReadModel,
  DépôtGarantiesFinancièresReadModelKey,
  RégionFrançaise,
  isRégionFrançaise,
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
      const régions = isSome(projet) ? projet.localité.région.split(' / ') : [];
      return régions.reduce((prev: RégionFrançaise[], current: string) => {
        if (isRégionFrançaise(current)) {
          return [...prev, current];
        }
        return prev;
      }, []);
    };

    switch (event.type) {
      case 'GarantiesFinancièresSnapshot-v1':
        if (!event.payload.aggregate.dépôt) {
          return;
        }
        if (isNone(dépôtGarantiesFinancières)) {
          const { typeGarantiesFinancières, dateÉchéance, attestationConstitution, dateDépôt } =
            event.payload.aggregate.dépôt;
          const régions = await getRégionsProjet(event.payload.identifiantProjet);
          await create<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey, {
            typeGarantiesFinancières,
            dateÉchéance,
            attestationConstitution,
            dateDépôt,
            dateDernièreMiseÀJour: dateDépôt,
            région: régions,
          });
        } else {
          // TO DO : ce cas ne devrait pas arriver, erreur à logguer ?
        }
        break;
      case 'GarantiesFinancièresDéposées-v1':
        const régions = await getRégionsProjet(event.payload.identifiantProjet);
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
            région: régions,
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
          région: régions,
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
          // TODO : ce cas ne devrait pas arriver - logguer erreur si pas de dépôt
        }

        await remove<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey);
      case 'DépôtGarantiesFinancièresSupprimé-v1':
        await remove<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey);
        break;
    }
  };

  mediator.register('EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR', handler);
};
