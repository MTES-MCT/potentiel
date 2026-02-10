import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { Candidature, IdentifiantProjet, RécupererGRDParVillePort } from '../../../../index.js';
import { LauréatNotifiéEvent } from '../../../notifier/lauréatNotifié.event.js';
import { AttribuerGestionnaireRéseauCommand } from '../../attribuer/attribuerGestionnaireRéseau.command.js';

type HandlerLauréatNotifiéProps = {
  event: LauréatNotifiéEvent;
  récupérerGRDParVille: RécupererGRDParVillePort;
};

export const handleLauréatNotifié = async ({
  event: {
    payload: { identifiantProjet },
  },
  récupérerGRDParVille,
}: HandlerLauréatNotifiéProps) => {
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
};
