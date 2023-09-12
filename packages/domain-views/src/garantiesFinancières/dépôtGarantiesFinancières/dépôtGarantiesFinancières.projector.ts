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
import { Create, Update, Find, Remove } from '@potentiel/core-domain-views';
import { RécupérerDétailProjetPort } from '../../domainViews.port';



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
          const région = await getRégionsProjet(event.payload.identifiantProjet);
          await create<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey, {
            ...event.payload.aggregate.dépôt,
            dateDernièreMiseÀJour: event.payload.aggregate.dépôt.dateDépôt,
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
        if (isNone(dépôtGarantiesFinancières)) {
          // TODO : logguer erreur si pas de dépôt existant
        }

        if (isSome(dépôtGarantiesFinancières)) {
          await remove<DépôtGarantiesFinancièresReadModel>(dépôtReadModelKey);
        }
        break;
    }
  };

  mediator.register('EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR', handler);
};
