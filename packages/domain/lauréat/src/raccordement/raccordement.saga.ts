import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { AbandonAccordéEvent } from '../abandon';
import { LauréatNotifiéEvent } from '../lauréat';

import { SupprimerRaccordementCommand } from './supprimer/supprimerRaccordement.command';
import { AttribuerGestionnaireRéseauCommand } from './attribuer/attribuerGestionnaireRéseau.command';

export type SubscriptionEvent = AbandonAccordéEvent | LauréatNotifiéEvent;

export type Execute = Message<'System.Lauréat.Raccordement.Saga.Execute', SubscriptionEvent>;

export type RécupererGRDParVillePort = (props: {
  codePostal: string;
  commune: string;
}) => Promise<Option.Type<{ codeEIC: string }>>;

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
        const grd = await récupérerGRDParVille({
          codePostal: candidature.localité.codePostal,
          commune: candidature.localité.commune,
        });
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
      case 'AbandonAccordé-V1':
        await mediator.send<SupprimerRaccordementCommand>({
          type: 'Lauréat.Raccordement.Command.SupprimerRaccordement',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
          },
        });
        break;
    }
  };
  mediator.register('System.Lauréat.Raccordement.Saga.Execute', handler);
};
