import { mediator } from 'mediateur';

import type { AchevementV2 } from '@potentiel-applications/api-documentation';
import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import { getUtilisateur, mapToRangeOptions } from '#helpers';

export const listerProjetsEnAttenteDAchevementHandler: AchevementV2['listerProjetsEnAttenteDAchevement'] =
  async (_, options) => {
    const { after, appelOffre, periode, depuis } = options ?? {};
    const utilisateur = getUtilisateur();

    const result = await mediator.send<Lauréat.Achèvement.ListerProjetsEnAttenteDAchevementQuery>({
      type: 'Lauréat.Achevement.Query.ListerProjetsEnAttenteDAchevement',
      data: {
        appelOffre: appelOffre ? [appelOffre] : undefined,
        periode,
        depuis: depuis ? DateTime.convertirEnValueType(depuis).formatter() : undefined,
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
          nomProjet,
          nomCandidat,
          dateNotification,
          sociétéMère,
          siren,
          siret,
          dossiersRaccordement,
          puissance,
          puissanceInitiale,
          cahierDesCharges,
          localité,
          représentantLégal,
          emailPorteurs,
          typeActionnariat,
          prix,
          coefficientKChoisi,
          presenceDeTrackers,
          gestionnaireRéseau,
          typologieInstallation,
          statut,
          technologie,
          coordonnéesGéodésiques,
          natureDeLExploitation,
          évaluationCarboneSimplifiée,
          typeDeTerrain,
        }) => ({
          identifiantProjet: identifiantProjet.formatter(),
          appelOffre: identifiantProjet.appelOffre,
          periode: identifiantProjet.période,
          famille: identifiantProjet.famille,
          nomProjet,
          numeroCre: identifiantProjet.numéroCRE,
          nomCandidat,
          dateNotification: dateNotification.formatterDate(),
          societeMere: sociétéMère,
          identification: siren || siret ? { siren, siret } : undefined,
          dossiersRaccordement: dossiersRaccordement.map(
            ({ référence, dateDemandeComplète, dateMiseEnService }) => ({
              reference: référence.formatter(),
              dateDemandeComplete: dateDemandeComplète?.formatterDate(),
              dateMiseEnService: dateMiseEnService?.formatterDate(),
            }),
          ),
          puissance,
          puissanceInitiale,
          cahierDesCharges: cahierDesCharges.formatter(),
          siteDeProduction: {
            adresse1: localité.adresse1,
            adresse2: localité.adresse2,
            codePostal: localité.codePostal,
            commune: localité.commune,
            departement: localité.département,
            region: localité.région,
          },
          representantLegal: représentantLégal
            ? { nom: représentantLégal.nom, _type: représentantLégal.type.formatter() }
            : undefined,
          emailPorteurs: emailPorteurs.map((email) => email.formatter()),
          typeActionnariat: typeActionnariat?.formatter(),
          prix,
          coefficientKChoisi,
          presenceDeTrackers,
          gestionnaireReseau: gestionnaireRéseau
            ? {
                raisonSociale: gestionnaireRéseau.raisonSociale,
                codeEic: gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
              }
            : undefined,
          typologieInstallation: typologieInstallation.map(({ typologie }) => typologie),
          statut: statut.formatter(),
          achevementEnAttente: true,
          technologie: technologie.type === 'N/A' ? undefined : technologie.type,
          coordonneesGeodesiques: coordonnéesGéodésiques,
          natureDeLExploitation: natureDeLExploitation
            ? {
                _type: natureDeLExploitation.type.formatter(),
                tauxPrevisionnelAci: natureDeLExploitation.tauxPrévisionnelACI,
                tauxPrevisionnelAcc: natureDeLExploitation.tauxPrévisionnelACC,
              }
            : undefined,
          evaluationCarboneSimplifiee: évaluationCarboneSimplifiée,
          typeDeTerrain,
        }),
      ),
    };
  };
