import { Parser } from '@json2csv/plainjs';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';

import { apiAction } from '@/utils/apiAction';
import { typeFournisseurLabel } from '@/app/laureats/[identifiant]/fournisseur/changement/typeFournisseurLabel';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const GET = async (_: Request) =>
  apiAction(async () =>
    withUtilisateur(async (utilisateur) => {
      const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
        type: 'Candidature.Query.ListerCandidatures',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
        },
      });

      const data = [];

      for (const candidature of candidatures.items) {
        for (const fournisseur of candidature.fournisseurs) {
          data.push({
            identifiantProjet: candidature.identifiantProjet.formatter(),
            appelOffre: candidature.identifiantProjet.appelOffre,
            periode: candidature.identifiantProjet.période,
            region: candidature.localité.région,
            societeMere: candidature.sociétéMère,
            typeFournisseur: typeFournisseurLabel[fournisseur.typeFournisseur.typeFournisseur],
            nomDuFabricant: fournisseur.nomDuFabricant,
            lieuDeFabrication: fournisseur.lieuDeFabrication,
          });
        }
      }

      const fields = [
        'identifiantProjet',
        'appelOffre',
        'periode',
        'region',
        'societeMere',
        'typeFournisseur',
        'nomDuFabricant',
        'lieuDeFabrication',
      ];

      const csvParser = new Parser({ fields, delimiter: ';', withBOM: true });

      const csv = csvParser.parse(data);

      const fileName = `export_projet_fournisseurs.csv`;

      return new Response(csv, {
        headers: {
          'content-type': 'text/csv',
          'content-disposition': `attachment; filename=${fileName}`,
        },
      });
    }),
  );
