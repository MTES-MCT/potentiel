import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon, Lauréat } from '@potentiel-domain/laureat';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import * as IdentifiantGestionnaireRéseau from '../gestionnaire/identifiantGestionnaireRéseau.valueType';

import { SupprimerRaccordementCommand } from './supprimer/supprimerRaccordement.command';
import { AttribuerGestionnaireRéseauCommand } from './attribuer/attribuerGestionnaireRéseau.command';

export type SubscriptionEvent = Abandon.AbandonAccordéEvent | Lauréat.LauréatNotifiéEvent;

export type Execute = Message<'System.Réseau.Raccordement.Saga.Execute', SubscriptionEvent>;

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

    const logger = getLogger('RaccordementSaga');
    switch (event.type) {
      case 'LauréatNotifié-V1':
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
        if (Option.isNone(grd)) {
          return;
        }

        logger.info('Attribution du gestionnaire réseau', { identifiantProjet, grd });

        await mediator.send<AttribuerGestionnaireRéseauCommand>({
          type: 'Réseau.Raccordement.Command.AttribuerGestionnaireRéseau',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
              grd.codeEIC,
            ),
          },
        });
        break;
      case 'AbandonAccordé-V1':
        await mediator.send<SupprimerRaccordementCommand>({
          type: 'Réseau.Raccordement.Command.SupprimerRaccordement',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
          },
        });
        break;
    }
  };
  mediator.register('System.Réseau.Raccordement.Saga.Execute', handler);
};
