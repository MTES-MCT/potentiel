import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { apiAction } from '@/utils/apiAction';

type DossierRaccordementCSV = {
  identifiantProjet: IdentifiantProjet.RawType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  periode: IdentifiantProjet.ValueType['période'];
  nomProjet: string;
  referenceDossier: Lauréat.Raccordement.RéférenceDossierRaccordement.RawType;
  dateDemandeCompleteRaccordement?: string;
  dateMiseEnService?: string;
  gestionnaireReseau: string;
  siteProduction: string;
  societeMere: string;
  puissance: string;
  prixReference?: number;
};

export const GET = async (_: Request) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const dossiers = await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementQuery',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
        },
      });

      const fields: ExportCSV.ParseJsonProps<DossierRaccordementCSV>['fields'] = [
        { label: 'Identifiant projet', value: 'identifiantProjet' },
        { label: "Appel d'offre", value: 'appelOffre' },
        { label: 'Période', value: 'periode' },
        { label: 'Nom projet', value: 'nomProjet' },
        { label: 'Référence dossier', value: 'referenceDossier' },
        { label: 'Date demande complète raccordement', value: 'dateDemandeCompleteRaccordement' },
        { label: 'Date mise en service', value: 'dateMiseEnService' },
        { label: 'Gestionnaire réseau', value: 'gestionnaireReseau' },
        { label: 'Site de production', value: 'siteProduction' },
        { label: 'Société mère', value: 'societeMere' },
        { label: 'Puissance', value: 'puissance' },
      ];

      const utilisateurPeutVoirPrix = utilisateur.rôle.aLaPermission('projet.accèsDonnées.prix');

      if (utilisateurPeutVoirPrix) {
        fields.push({ label: 'Prix de référence', value: 'prixReference' });
      }

      const data: Array<DossierRaccordementCSV> = dossiers.items.map(
        ({
          identifiantProjet,
          nomProjet,
          référenceDossier,
          puissance,
          unitéPuissance,
          sociétéMère,
          dateDemandeComplèteRaccordement,
          dateMiseEnService,
          raisonSocialeGestionnaireRéseau,
          localité: { adresse1, adresse2, codePostal, commune, région, département },
          prixReference,
        }) => ({
          identifiantProjet: identifiantProjet.formatter(),
          appelOffre: identifiantProjet.appelOffre,
          periode: identifiantProjet.période,
          nomProjet,
          referenceDossier: référenceDossier.formatter(),
          dateDemandeCompleteRaccordement: dateDemandeComplèteRaccordement
            ? dateDemandeComplèteRaccordement.date.toLocaleDateString('fr-FR')
            : undefined,
          dateMiseEnService: dateMiseEnService
            ? dateMiseEnService.date.toLocaleDateString('fr-FR')
            : undefined,
          gestionnaireReseau: raisonSocialeGestionnaireRéseau,
          siteProduction: `${adresse1} ${adresse2} ${codePostal} ${commune} - ${département} - ${région}`,
          societeMere: sociétéMère,
          puissance: `${puissance} ${unitéPuissance.formatter()}`,
          prixReference: utilisateurPeutVoirPrix ? prixReference : undefined,
        }),
      );

      const csv = await ExportCSV.parseJson<DossierRaccordementCSV[]>({
        data,
        fields,
      });

      const fileName = `export_projet_raccordement.csv`;

      return new Response(csv, {
        headers: {
          'content-type': 'text/csv',
          'content-disposition': `attachment; filename=${fileName}`,
        },
      });
    }),
  );
