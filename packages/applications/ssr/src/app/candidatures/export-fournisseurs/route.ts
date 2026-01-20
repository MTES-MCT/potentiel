import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

type CandidatureFournisseurCSV = {
  identifiantProjet: IdentifiantProjet.RawType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  periode: IdentifiantProjet.ValueType['période'];
  region: Candidature.Localité.ValueType['région'];
  societeMere: string;
} & Record<string, string>;

export const GET = async (_: Request) =>
  apiAction(async () =>
    withUtilisateur(async (utilisateur) => {
      const fournisseursÀLaCandidature =
        await mediator.send<Candidature.ListerDétailsFournisseurQuery>({
          type: 'Candidature.Query.ListerDétailsFournisseur',
          data: {
            utilisateur: utilisateur.identifiantUtilisateur.email,
          },
        });

      const fournisseurCandidatureFields = Array.from(
        new Set(fournisseursÀLaCandidature.items.map(({ détail }) => Object.keys(détail)).flat()),
      ).map((field) => ({
        label: field,
        value: field,
      }));

      const csv = await ExportCSV.toCSV<CandidatureFournisseurCSV>({
        fields: [
          { label: 'Identifiant projet', value: 'identifiantProjet' },
          { label: "Appel d'offre", value: 'appelOffre' },
          { label: 'Période', value: 'periode' },
          { label: 'Région', value: 'region' },
          { label: 'Société mère', value: 'societeMere' },
          ...fournisseurCandidatureFields,
        ],
        data: fournisseursÀLaCandidature.items.map((fournisseur) => ({
          identifiantProjet: fournisseur.identifiantProjet.formatter(),
          appelOffre: fournisseur.identifiantProjet.appelOffre,
          periode: fournisseur.identifiantProjet.période,
          region: fournisseur.région,
          societeMere: fournisseur.sociétéMère,
          ...fournisseur.détail,
        })),
      });

      const fileName = `export_candidature_fournisseurs.csv`;

      return new Response(csv, {
        headers: {
          'content-type': 'text/csv',
          'content-disposition': `attachment; filename=${fileName}`,
        },
      });
    }),
  );
