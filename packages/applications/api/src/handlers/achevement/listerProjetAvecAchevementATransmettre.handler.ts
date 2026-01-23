import { mediator } from 'mediateur';

import { AchevementV1 } from '@potentiel-applications/api-documentation';
import { Lauréat } from '@potentiel-domain/projet';

import { getUtilisateur, mapToRangeOptions } from '#helpers';

export const listerProjetAvecAchevementATransmettreHandler: AchevementV1['listerProjetAvecAchevementATransmettre'] =
  async (_, options) => {
    const { after, appelOffre, periode } = options ?? {};
    const utilisateur = getUtilisateur();

    const result =
      await mediator.send<Lauréat.Achèvement.ListerProjetAvecAchevementATransmettreQuery>({
        type: 'Lauréat.Achevement.Query.ListerProjetAvecAchevementATransmettre',
        data: {
          appelOffre,
          periode,
          identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
          range: mapToRangeOptions(after),
        },
      });

    return {
      range: result.range,
      total: result.total,
      items: result.items.map(
        ({
          identifiantProjet,
          identifiantGestionnaireReseau,
          référenceDossierRaccordement,
          localité,
          dateDCR,
          prix,
          coefficientKChoisi,
          dateNotification,
          nomProjet,
          puissance,
          puissanceInitiale,
        }) => ({
          identifiantProjet: identifiantProjet.formatter(),
          nomProjet,
          identifiantGestionnaireReseau: identifiantGestionnaireReseau.formatter(),
          appelOffre: identifiantProjet.appelOffre,
          periode: identifiantProjet.période,
          referenceDossierRaccordement: référenceDossierRaccordement.formatter(),
          dateDcr: dateDCR?.formatterDate(),
          prix,
          coefficientKChoisi,
          dateNotification: dateNotification.formatterDate(),
          siteDeProduction: {
            adresse1: localité.adresse1,
            adresse2: localité.adresse2,
            codePostal: localité.codePostal,
            commune: localité.commune,
            departement: localité.département,
            region: localité.région,
          },
          puissance,
          puissanceInitiale,
        }),
      ),
    };
  };
