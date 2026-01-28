import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

type DétailFournisseurCSV = {
  identifiantProjet: string;
  appelOffre: string;
  periode: string;
  region: string;
  societeMere: string;
} & Candidature.DétailFournisseur;

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

      const data: Array<DétailFournisseurCSV> = [];

      for (const projet of fournisseursÀLaCandidature.items) {
        for (const fournisseur of projet.fournisseurs) {
          data.push({
            identifiantProjet: projet.identifiantProjet.formatter(),
            appelOffre: projet.identifiantProjet.appelOffre,
            periode: projet.identifiantProjet.période,
            region: projet.région,
            societeMere: projet.sociétéMère,
            typeFournisseur: fournisseur.typeFournisseur,
            nomDuFabricant: fournisseur.nomDuFabricant ?? '',
            lieuDeFabrication: fournisseur.lieuDeFabrication ?? '',
            coûtTotalLot: fournisseur.coûtTotalLot ?? '',
            contenuLocalFrançais: fournisseur.contenuLocalFrançais ?? '',
            contenuLocalEuropéen: fournisseur.contenuLocalEuropéen ?? '',
            technologie: fournisseur.technologie ?? '',
            puissanceCrêteWc: fournisseur.puissanceCrêteWc ?? '',
            rendementNominal: fournisseur.rendementNominal ?? '',
            référenceCommerciale: fournisseur.référenceCommerciale ?? '',
          });
        }
      }

      const csv = await ExportCSV.toCSV<DétailFournisseurCSV>({
        fields: [
          { label: 'Identifiant projet', value: 'identifiantProjet' },
          { label: "Appel d'offre", value: 'appelOffre' },
          { label: 'Période', value: 'periode' },
          { label: 'Région', value: 'region' },
          { label: 'Société mère', value: 'societeMere' },
          { label: 'Type de fournisseur', value: 'typeFournisseur' },
          { label: 'Nom du fabricant', value: 'nomDuFabricant' },
          { label: 'Lieu de fabrication', value: 'lieuDeFabrication' },
          { label: 'Coût total du lot', value: 'coûtTotalLot' },
          { label: 'Contenu local français (%)', value: 'contenuLocalFrançais' },
          { label: 'Contenu local européen (%)', value: 'contenuLocalEuropéen' },
          { label: 'Technologie', value: 'technologie' },
          { label: 'Puissance crête (Wc)', value: 'puissanceCrêteWc' },
          { label: 'Rendement nominal (%)', value: 'rendementNominal' }, // TODO: voir si on garde ou pas
          { label: 'Référence commerciale', value: 'référenceCommerciale' }, // TODO: voir si on garde ou pas
        ],
        data,
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
