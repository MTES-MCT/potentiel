import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { LauréatNotifiéEvent } from '../../notifier/lauréatNotifié.event';
import { Candidature, IdentifiantProjet, RécupererGRDParVillePort } from '../../..';
import { AttribuerGestionnaireRéseauCommand } from '../attribuer/attribuerGestionnaireRéseau.command';

type Event = { version: number; created_at: string; stream_id: string };
export type SubscriptionEvent = LauréatNotifiéEvent & Event;

export type Execute = Message<'System.Lauréat.Raccordement.Saga.Execute', SubscriptionEvent>;

export type RegisterRaccordementSagaDependencies = {
  récupérerGRDParVille: RécupererGRDParVillePort;
};

export const register = ({ récupérerGRDParVille }: RegisterRaccordementSagaDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet },
    } = event;

    switch (event.type) {
      case 'LauréatNotifié-V2':
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
        break;
    }
  };
  mediator.register('System.Lauréat.Raccordement.Saga.Execute', handler);
};
