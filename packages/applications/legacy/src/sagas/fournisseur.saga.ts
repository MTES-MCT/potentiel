import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger, ok } from '../core/utils';
import { Lauréat } from '@potentiel-domain/projet';
import { eventStore } from '../config/eventStore.config';
import {
  FournisseurKind,
  ProjectDataCorrected,
  ProjectFournisseursUpdated,
} from '../modules/project';
import { Option } from '@potentiel-libraries/monads';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';

export type SubscriptionEvent = Lauréat.Fournisseur.FournisseurEvent;

export type Execute = Message<'System.Saga.Fournisseur', SubscriptionEvent>;

const CORRESPONDANCE_CHAMPS_FOURNISSEURS: Record<
  Lauréat.Fournisseur.TypeFournisseur.RawType,
  FournisseurKind
> = {
  'module-ou-films': 'Nom du fabricant \n(Modules ou films)',
  cellules: 'Nom du fabricant (Cellules)',
  'plaquettes-silicium': 'Nom du fabricant \n(Plaquettes de silicium (wafers))',
  polysilicium: 'Nom du fabricant \n(Polysilicium)',
  'postes-conversion': 'Nom du fabricant \n(Postes de conversion)',
  structure: 'Nom du fabricant \n(Structure)',
  'dispositifs-stockage-energie': 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)',
  'dispositifs-suivi-course-soleil':
    'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)',
  'autres-technologies': 'Nom du fabricant \n(Autres technologies)',
  'dispositif-de-production': 'Nom du fabricant \n(dispositif de production)',
  'dispositif-de-stockage': 'Nom du fabricant \n(Dispositif de stockage)',
  'poste-conversion': 'Nom du fabricant \n(Poste de conversion)',
};

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

    const projet = await getLegacyProjetByIdentifiantProjet(identifiantProjet);

    if (!projet) {
      logger.warning('Identifiant projet inconnu', {
        saga: 'System.Saga.Fournisseur',
        event,
      });
      return;
    }

    switch (type) {
      case 'ChangementFournisseurEnregistré-V1':
        const updatedBy = await new Promise<string>((r) =>
          getUserByEmail(payload.enregistréPar).map((user) => {
            r(user?.id ?? '');
            return ok(user);
          }),
        );
        const { fournisseurs, évaluationCarboneSimplifiée } = payload;

        const fournisseurActuel =
          await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
            type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
            data: { identifiantProjet: identifiantProjet.formatter() },
          });

        const referenceFournisseursArray = fournisseurs
          ? fournisseurs
          : Option.isSome(fournisseurActuel)
            ? fournisseurActuel.fournisseurs
            : [];

        await eventStore.publish(
          new ProjectFournisseursUpdated({
            payload: {
              projectId: projet.id,
              newFournisseurs: referenceFournisseursArray.map((fournisseur) => ({
                kind: CORRESPONDANCE_CHAMPS_FOURNISSEURS[fournisseur.typeFournisseur],
                name: fournisseur.nomDuFabricant,
              })),
              newEvaluationCarbone: évaluationCarboneSimplifiée
                ? évaluationCarboneSimplifiée
                : Option.isSome(fournisseurActuel)
                  ? fournisseurActuel.évaluationCarboneSimplifiée
                  : undefined,
              updatedBy: updatedBy,
            },
          }),
        );

        break;

      case 'ÉvaluationCarboneSimplifiéeModifiée-V1':
        const correctedBy = await new Promise<string>((r) =>
          getUserByEmail(payload.modifiéePar).map((user) => {
            r(user?.id ?? '');
            return ok(user);
          }),
        );

        await eventStore.publish(
          new ProjectDataCorrected({
            payload: {
              correctedBy,
              projectId: projet.id,
              correctedData: {
                evaluationCarbone: payload.évaluationCarboneSimplifiée,
              },
            },
          }),
        );

        break;
    }
  };

  mediator.register('System.Saga.Fournisseur', handler);
};
