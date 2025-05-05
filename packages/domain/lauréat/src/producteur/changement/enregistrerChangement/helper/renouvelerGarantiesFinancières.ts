import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { GarantiesFinancières } from '../../../..';
import { appelOffreSoumisAuxGarantiesFinancières } from '../../../../garantiesFinancières';

export const renouvelerGarantiesFinancières = async ({
  identifiantProjet,
  identifiantUtilisateur,
  hasGarantiesFinancières,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  hasGarantiesFinancières: boolean;
}) => {
  const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: {
      identifiantAppelOffre: identifiantProjet.appelOffre,
    },
  });

  if (
    Option.isSome(appelOffre) &&
    appelOffreSoumisAuxGarantiesFinancières({
      appelOffre,
      famille: identifiantProjet.famille,
      période: identifiantProjet.période,
    })
  ) {
    const dateActuelle = DateTime.now();

    if (hasGarantiesFinancières) {
      await mediator.send<GarantiesFinancières.EffacerHistoriqueGarantiesFinancièresCommand>({
        type: 'Lauréat.GarantiesFinancières.Command.EffacerHistoriqueGarantiesFinancières',
        data: {
          identifiantProjet,
          effacéLe: dateActuelle,
          effacéPar: identifiantUtilisateur,
        },
      });
    }

    await mediator.send<GarantiesFinancières.DemanderGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
      data: {
        demandéLe: dateActuelle,
        identifiantProjet,
        dateLimiteSoumission: dateActuelle.ajouterNombreDeMois(2),
        motif: GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur,
      },
    });
  }
};
