import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { GarantiesFinancières } from '../../../..';
import { appelOffreSoumisAuxGarantiesFinancières } from '../../../../garantiesFinancières';

export const renouvelerGarantiesFinancières = async ({
  identifiantProjet,
  identifiantUtilisateur,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: string;
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
    const dateActuelle = DateTime.now().date;

    const garantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

    if (Option.isSome(garantiesFinancières)) {
      await mediator.send<GarantiesFinancières.EffacerHistoriqueGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EffacerHistoriqueGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          effacéLeValue: dateActuelle.toISOString(),
          effacéParValue: identifiantUtilisateur,
        },
      });
    }

    await mediator.send<GarantiesFinancières.DemanderGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
      data: {
        demandéLeValue: dateActuelle.toISOString(),
        identifiantProjetValue: identifiantProjet.formatter(),
        dateLimiteSoumissionValue: new Date(
          dateActuelle.setMonth(dateActuelle.getMonth() + 2),
        ).toISOString(),
        motifValue:
          GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur.motif,
      },
    });
  }
};
