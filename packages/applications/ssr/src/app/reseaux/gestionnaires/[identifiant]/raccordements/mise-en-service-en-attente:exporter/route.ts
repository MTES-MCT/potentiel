import { Parser } from '@json2csv/plainjs';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { OperationRejectedError } from '@potentiel-domain/core';
import { Raccordement } from '@potentiel-domain/laureat';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';

type ExporterRaccordementParameter = {
  params: {
    identifiant: string;
  };
};

export const GET = async (_: Request, { params: { identifiant } }: ExporterRaccordementParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantGestionnaireRéseau = decodeParameter(identifiant);
      vérifierAccèsAuGestionnaireRéseau(utilisateur, identifiantGestionnaireRéseau);

      const dossiers =
        await mediator.send<Raccordement.ListerDossierRaccordementEnAttenteMiseEnServiceQuery>({
          type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
          data: {
            identifiantGestionnaireRéseau,
          },
        });

      const fields = [
        'nomProjet',
        'identifiantProjet',
        'appelOffre',
        'periode',
        'famille',
        'numeroCRE',
        'commune',
        'codePostal',
        'referenceDossier',
        'statutDGEC',
        'puissance',
        'dateMiseEnService',
        'nomCandidat',
        'societeMere',
        'emailContact',
        'siteProduction',
        'dateNotification',
      ];

      const csvParser = new Parser({ fields, delimiter: ';', withBOM: true });

      const csv = csvParser.parse(
        dossiers.items.map(
          ({
            appelOffre,
            codePostal,
            commune,
            famille,
            identifiantProjet,
            nomProjet,
            numéroCRE,
            période,
            référenceDossier,
            statutDGEC,
            puissance,
            dateNotification,
            emailContact,
            nomCandidat,
            siteProduction,
            sociétéMère,
          }) => ({
            nomProjet,
            identifiantProjet: identifiantProjet.formatter(),
            appelOffre,
            periode: période,
            famille,
            numeroCRE: numéroCRE,
            commune,
            codePostal,
            referenceDossier: référenceDossier.formatter(),
            statutDGEC,
            puissance,
            nomCandidat,
            societeMere: sociétéMère,
            emailContact,
            siteProduction,
            dateNotification,
          }),
        ),
      );

      const gestionnaire = await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>(
        {
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau: identifiant,
          },
        },
      );

      const fileName = `export_raccordement_en_attente_mise_en_service-${Option.match(gestionnaire)
        .some(({ raisonSociale }) => raisonSociale)
        .none(() => '')}`;

      return new Response(csv, {
        headers: {
          'content-type': 'text/csv',
          'content-disposition': `attachment; filename=${fileName}.csv`,
        },
      });
    }),
  );

function vérifierAccèsAuGestionnaireRéseau(
  utilisateur: Utilisateur.ValueType,
  identifiantGestionnaireRéseau: string,
) {
  if (!utilisateur.role.estÉgaleÀ(Role.grd)) return;
  if (
    Option.isSome(utilisateur.identifiantGestionnaireRéseau) &&
    utilisateur.identifiantGestionnaireRéseau === identifiantGestionnaireRéseau
  ) {
    return;
  }
  throw new OperationRejectedError(`Accès refusé`);
}
