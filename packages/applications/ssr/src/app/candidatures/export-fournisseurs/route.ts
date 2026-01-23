import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

type DétailFournisseurCSV = {
  identifiantProjet: IdentifiantProjet.RawType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  periode: IdentifiantProjet.ValueType['période'];
  region: Candidature.Localité.ValueType['région'];
  societeMere: string;
  typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.RawType;
  nomFabricant: string;
  lieuFabrication: string;
  coutTotalLot: string;
  contenuLocalFrançais: string;
  contenuLocalEuropéen: string;
  technologie: string;
  puissanceCrêteWc: string;
  rendementNominal: string;
};

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
            nomFabricant: fournisseur.nomDuFabricant ?? '',
            lieuFabrication: fournisseur.lieuDeFabrication ?? '',
            coutTotalLot: fournisseur.coûtTotalLot ?? '',
            contenuLocalFrançais: fournisseur.contenuLocalFrançais ?? '',
            contenuLocalEuropéen: fournisseur.contenuLocalEuropéen ?? '',
            technologie: fournisseur.technologie ?? '',
            puissanceCrêteWc: fournisseur.puissanceCrêteWc ?? '',
            rendementNominal: fournisseur.rendementNominal ?? '',
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
          { label: 'Nom du fabricant', value: 'nomFabricant' },
          { label: 'Lieu de fabrication', value: 'lieuFabrication' },
          { label: 'Coût total du lot', value: 'coutTotalLot' },
          { label: 'Contenu local français (%)', value: 'contenuLocalFrançais' },
          { label: 'Contenu local européen (%)', value: 'contenuLocalEuropéen' },
          { label: 'Technologie', value: 'technologie' },
          { label: 'Puissance crête (Wc)', value: 'puissanceCrêteWc' },
          { label: 'Rendement nominal (%)', value: 'rendementNominal' },
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
