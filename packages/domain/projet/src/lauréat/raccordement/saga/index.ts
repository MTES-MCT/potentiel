import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { DateTime } from '@potentiel-domain/common';

import { LauréatNotifiéEvent } from '../../notifier/lauréatNotifié.event';
import { Candidature, IdentifiantProjet, Lauréat, RécupererGRDParVillePort } from '../../..';
import { AttribuerGestionnaireRéseauCommand } from '../attribuer/attribuerGestionnaireRéseau.command';
import { AjouterTâchePlanifiéeCommand } from '../../tâche-planifiée/ajouter/ajouterTâchePlanifiée.command';
import { TypeTâchePlanifiéeRaccordement } from '..';

type Event = { version: number; created_at: string; stream_id: string };
export type SubscriptionEvent = (
  | LauréatNotifiéEvent
  | Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent
) &
  Event;

export type Execute = Message<'System.Lauréat.Raccordement.Saga.Execute', SubscriptionEvent>;

export type RegisterRaccordementSagaDependencies = {
  récupérerGRDParVille: RécupererGRDParVillePort;
};

export const register = ({ récupérerGRDParVille }: RegisterRaccordementSagaDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    return match(event)
      .with({ type: 'LauréatNotifié-V2' }, async ({ payload: { identifiantProjet } }) => {
        const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
          type: 'Candidature.Query.ConsulterCandidature',
          data: {
            identifiantProjet,
          },
        });
        if (Option.isNone(candidature)) {
          throw new Error('Candidature non trouvée');
        }
        const commune = candidature.dépôt.localité.commune.split('/')[0].trim();
        const codePostal = candidature.dépôt.localité.codePostal.split('/')[0].trim();
        const grd = await récupérerGRDParVille({ codePostal, commune });
        const identifiantGestionnaireRéseau = Option.match(grd)
          .some((grd) =>
            GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(grd.codeEIC),
          )
          .none(() => GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu);

        await mediator.send<AttribuerGestionnaireRéseauCommand>({
          type: 'Lauréat.Raccordement.Command.AttribuerGestionnaireRéseau',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            identifiantGestionnaireRéseau,
          },
        });
      })
      .with(
        { type: 'TâchePlanifiéeExecutée-V1' },
        async ({ payload: { typeTâchePlanifiée, identifiantProjet, exécutéeLe } }) => {
          if (typeTâchePlanifiée === TypeTâchePlanifiéeRaccordement.premièreRelanceDeuxMois.type) {
            await mediator.send<AjouterTâchePlanifiéeCommand>({
              type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
              data: {
                identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
                typeTâchePlanifiée: TypeTâchePlanifiéeRaccordement.relanceUnMois.type,
                àExécuterLe: DateTime.convertirEnValueType(exécutéeLe).ajouterNombreDeMois(1),
              },
            });
          }
        },
      )
      .exhaustive();
  };
  mediator.register('System.Lauréat.Raccordement.Saga.Execute', handler);
};
