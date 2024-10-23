import { Parser } from '@json2csv/plainjs';
import { mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { Raccordement } from '@potentiel-domain/reseau';

import { withUtilisateur } from '@/utils/withUtilisateur';

type ExporterRaccordementParameter = {
  params: {
    identifiant: string;
  };
};

export const GET = async (_: Request, { params: { identifiant } }: ExporterRaccordementParameter) =>
  withUtilisateur(async () => {
    getLogger().debug(identifiant);
    const dossiers =
      await mediator.send<Raccordement.ListerDossierRaccordementEnAttenteMiseEnServiceQuery>({
        type: 'Réseau.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
        data: {
          identifiantGestionnaireRéseau: identifiant,
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

    return new Response(csv, {
      headers: {
        'content-type': 'text/csv',
      },
    });
  });
