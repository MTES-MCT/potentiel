import { Parser } from '@json2csv/plainjs';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { Groupe, Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { OperationRejectedError } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';

type ExporterRaccordementParameter = {
  params: {
    identifiant: string;
  };
};

export const GET = async (_: Request, { params: { identifiant } }: ExporterRaccordementParameter) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantGestionnaireRéseau = decodeParameter(identifiant);
    vérifierAccèsAuGestionnaireRéseau(utilisateur, identifiantGestionnaireRéseau);

    const dossiers =
      await mediator.send<Raccordement.ListerDossierRaccordementEnAttenteMiseEnServiceQuery>({
        type: 'Réseau.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
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
      'dateMiseEnService',
    ];

    const csvParser = new Parser({ fields, delimiter: ';' });

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
        }),
      ),
    );

    const gestionnaire = await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
      type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseau: identifiant,
      },
    });

    const fileName = `export_raccordement_en_attente_mise_en_service-${Option.match(gestionnaire)
      .some(({ raisonSociale }) => raisonSociale)
      .none(() => '')}`;

    return new Response(csv, {
      headers: {
        'content-type': 'text/csv',
        'content-disposition': `attachment; filename=${fileName}.csv`,
      },
    });
  });

function vérifierAccèsAuGestionnaireRéseau(
  utilisateur: Utilisateur.ValueType,
  identifiantGestionnaireRéseau: string,
) {
  if (!utilisateur.role.estÉgaleÀ(Role.grd)) return;
  if (
    Option.isSome(utilisateur.groupe) &&
    utilisateur.groupe.estÉgaleÀ(
      Groupe.convertirEnValueType(`/GestionnairesRéseau/${identifiantGestionnaireRéseau}`),
    )
  ) {
    return;
  }
  throw new OperationRejectedError(`Accès refusé`);
}
