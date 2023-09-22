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
import { Create, Update, Find, Remove, RebuildTriggered } from '@potentiel/core-domain-views';
import { RécupérerDétailProjetPort } from '../../domainViews.port';

export type ExecuteDépôtGarantiesFinancièresProjector = Message<
  'EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR',
  DépôtGarantiesFinancièresEvent | RebuildTriggered
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
    if (event.type === 'RebuildTriggered') {
      return remove<DépôtGarantiesFinancièresReadModel>(
        `dépôt-garanties-financières|${event.payload.id}`,
      );
    }
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
        if (event.payload.aggregate.dépôt) {
          const { attestationConstitution, dateDépôt, dateÉchéance, typeGarantiesFinancières } =
            event.payload.aggregate.dépôt;
          const région = await getRégionsProjet(event.payload.identifiantProjet);

          const readModel = {
            typeGarantiesFinancières:
              typeGarantiesFinancières === 'Type inconnu' ? undefined : typeGarantiesFinancières,
            dateÉchéance: dateÉchéance === 'Date inconnue' ? undefined : dateÉchéance,
            attestationConstitution,
            dateDernièreMiseÀJour: dateDépôt,
            région,
            identifiantProjet: event.payload.identifiantProjet,
            dateDépôt: dateDépôt,
          };

          if (isNone(dépôtGarantiesFinancières)) {
            await create<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey, readModel);
          } else {
            await update<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey, readModel);
          }
        }

        break;
      case 'GarantiesFinancièresDéposées-v1':
        const région = await getRégionsProjet(event.payload.identifiantProjet);
        if (isSome(dépôtGarantiesFinancières)) {
          // TODO : logger erreur (on ne devrait pas pouvoir déposer des GF si dépôt déjà existant)
          break;
        }

        await create<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey, {
          typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
          ...('dateÉchéance' in event.payload && { dateÉchéance: event.payload.dateÉchéance }),
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
          // TODO : logger erreur (on ne devrait pas modifier un dépôt inexistant)
          break;
        }
        await update<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey, {
          ...dépôtGarantiesFinancières,
          dateDernièreMiseÀJour: event.payload.dateModification,
          typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
          dateÉchéance:
            event.payload.typeGarantiesFinancières === "avec date d'échéance"
              ? event.payload.dateÉchéance
              : undefined,
          attestationConstitution: {
            format: event.payload.attestationConstitution.format,
            date: event.payload.attestationConstitution.date,
          },
        });
        break;
      case 'DépôtGarantiesFinancièresSupprimé-v1':
      case 'DépôtGarantiesFinancièresValidé-v1':
        if (isNone(dépôtGarantiesFinancières)) {
          // TODO : logguer erreur si pas de dépôt existant
          break;
        }

        if (isSome(dépôtGarantiesFinancières)) {
          await remove<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey);
        }
        break;
    }
  };

  mediator.register('EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR', handler);
};
