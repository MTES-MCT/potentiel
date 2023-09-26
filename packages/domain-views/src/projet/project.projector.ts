import { Message, MessageHandler, mediator } from 'mediateur';
import {
  AbandonEvent,
  GestionnaireRéseauProjetEvent,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { isNone, isSome } from '@potentiel/monads';
import { ProjetReadModel, ProjetReadModelKey } from './projet.readModel';
import { Find, RebuildTriggered, Remove, Upsert } from '@potentiel/core-domain-views';
import { ConsulterLegacyProjetQuery } from './projet.query';
import { NotFoundError } from '@potentiel/core-domain';

export type ExecuteProjetProjector = Message<
  'EXECUTE_PROJET_PROJECTOR',
  GestionnaireRéseauProjetEvent | AbandonEvent | RebuildTriggered
>;

export type ProjetProjectorDependencies = {
  upsert: Upsert;
  find: Find;
  remove: Remove;
};

export const registerProjetProjector = ({ upsert, find, remove }: ProjetProjectorDependencies) => {
  const handler: MessageHandler<ExecuteProjetProjector> = async (event) => {
    if (event.type === 'RebuildTriggered') {
      await remove<ProjetReadModel>(`projet|${event.payload.id}`);
    } else {
      const key: ProjetReadModelKey = `projet|${
        event.payload.identifiantProjet as `${string}#${string}#${string}#${string}`
      }`;

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // WARNING
      // Le code précédent le switch utilise une query afin de commencer la bascule avec le legacy sur la partie projet.
      // N'utilisez pas de query dans d'autre projector pour l'instant
      const { appelOffre, famille, numéroCRE, période } = convertirEnIdentifiantProjet(
        event.payload.identifiantProjet as `${string}#${string}#${string}#${string}`,
      );
      const projet = await mediator.send<ConsulterLegacyProjetQuery>({
        data: {
          identifiantProjet: {
            appelOffre,
            famille,
            numéroCRE,
            période,
          },
        },
        type: 'CONSULTER_LEGACY_PROJET',
      });

      if (isNone(projet)) {
        throw new NotFoundError('Projet not found');
      }

      const projection = await find<ProjetReadModel>(key);

      const { localité, nom, statut } = projet;

      let projetToUpdate: Omit<ProjetReadModel, 'type'> = {
        appelOffre,
        famille: isSome(famille) ? famille : '',
        numéroCRE,
        période,
        localité,
        nom,
        statut,
      };

      if (isSome(projection)) {
        projetToUpdate = {
          ...projetToUpdate,
          identifiantGestionnaire: projection.identifiantGestionnaire,
        };
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      switch (event.type) {
        case 'GestionnaireRéseauProjetDéclaré':
        case 'GestionnaireRéseauProjetModifié':
          await upsert<ProjetReadModel>(key, {
            ...projetToUpdate,
            identifiantGestionnaire: {
              codeEIC: event.payload.identifiantGestionnaireRéseau,
            },
          });
          break;
        case 'AbandonDemandé':
          await upsert<ProjetReadModel>(key, {
            ...projetToUpdate,
            statut: 'abandonné',
            dateAbandon: event.payload.dateAbandon,
            recandidature: event.payload.avecRecandidature ? true : undefined,
            piéceJustificative: event.payload.piéceJustificative,
          });
      }
    }
  };

  mediator.register('EXECUTE_PROJET_PROJECTOR', handler);
};
