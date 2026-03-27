import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Email } from '@potentiel-domain/common';

import { Candidature, IdentifiantProjet, RécupererGRDParVillePort } from '../../../../index.js';
import { LauréatNotifiéEvent } from '../../../notifier/lauréatNotifié.event.js';
import { AttribuerGestionnaireRéseauCommand } from '../../attribuer/attribuerGestionnaireRéseau.command.js';
import { TransmettreDemandeComplèteRaccordementCommand } from '../../transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.command.js';
import { FormatRéférenceDossierRaccordementInvalideError } from '../../errors.js';

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

  if (candidature.dépôt.raccordements?.length) {
    for (const raccordement of candidature.dépôt.raccordements) {
      try {
        await mediator.send<TransmettreDemandeComplèteRaccordementCommand>({
          type: 'Lauréat.Raccordement.Command.TransmettreDemandeComplèteRaccordement',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            référenceDossier: raccordement.référence,
            dateQualification: raccordement.dateQualification,
            transmisePar: Email.système,
          },
        });
      } catch (error) {
        if (error instanceof FormatRéférenceDossierRaccordementInvalideError) {
          continue;
        } else {
          throw error;
        }
      }
    }
  }
};
