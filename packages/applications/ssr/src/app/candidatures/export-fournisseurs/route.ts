import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

type DétailFournisseurCSV = {
  identifiantProjet: IdentifiantProjet.RawType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  periode: IdentifiantProjet.ValueType['période'];
  famille: IdentifiantProjet.ValueType['famille'];
  numéroCRE: IdentifiantProjet.ValueType['numéroCRE'];
  nomProjet: string;
  statutCandidature: Candidature.StatutCandidature.RawType;
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

      const fournisseurs = fournisseursÀLaCandidature.items
        .map((projet) =>
          projet.fournisseurs.map((fournisseur) => ({
            identifiantProjet: projet.identifiantProjet.formatter(),
            appelOffre: projet.identifiantProjet.appelOffre,
            periode: projet.identifiantProjet.période,
            famille: projet.identifiantProjet.famille,
            numéroCRE: projet.identifiantProjet.numéroCRE,
            nomProjet: projet.nomProjet,
            statutCandidature: projet.statutCandidature.formatter(),
            region: projet.région,
            societeMere: projet.sociétéMère,
            ...fournisseur,
          })),
        )
        .flat();

      const csv = await ExportCSV.toCSV<DétailFournisseurCSV>({
        fields: [
          { label: 'Identifiant projet', value: 'identifiantProjet' },
          { label: "Appel d'offre", value: 'appelOffre' },
          { label: 'Période', value: 'periode' },
          { label: 'Famille', value: 'famille' },
          { label: 'Numéro CRE', value: 'numéroCRE' },
          { label: 'Nom du projet', value: 'nomProjet' },
          { label: 'Statut de la candidature', value: 'statutCandidature' },
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
        data: fournisseurs,
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
