import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';
import { AjouterStatistiqueUtilisationCommand } from '@potentiel-domain/statistiques-utilisation';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { apiAction } from '@/utils/apiAction';
import { getFiltresActifs } from '@/app/_helpers/getFiltresActifs';

type DossierRaccordementCSV = {
  identifiantProjet: IdentifiantProjet.RawType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  periode: IdentifiantProjet.ValueType['période'];
  famille: IdentifiantProjet.ValueType['famille'];
  numeroCRE: IdentifiantProjet.ValueType['numéroCRE'];
  statutProjet: Lauréat.StatutLauréat.RawType;
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

export const GET = async (request: Request) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const { searchParams } = new URL(request.url);

      const appelOffre = searchParams.getAll('appelOffre') ?? undefined;
      const periode = searchParams.get('periode') ?? undefined;
      const famille = searchParams.get('famille') ?? undefined;
      const statut = searchParams.getAll('statut') ?? undefined;
      const typeActionnariat = searchParams.getAll('typeActionnariat') ?? undefined;

      const dossiers = await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementQuery',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          appelOffre,
          famille,
          periode,
          statutProjet: statut.length
            ? statut.map((value) => Lauréat.StatutLauréat.convertirEnValueType(value).formatter())
            : undefined,
          typeActionnariat: typeActionnariat.length
            ? typeActionnariat.map((value) =>
                Candidature.TypeActionnariat.convertirEnValueType(value).formatter(),
              )
            : undefined,
        },
      });

      const fields: ExportCSV.ToCSVProps<DossierRaccordementCSV>['fields'] = [
        { label: 'Identifiant projet', value: 'identifiantProjet' },
        { label: "Appel d'offre", value: 'appelOffre' },
        { label: 'Période', value: 'periode' },
        { label: 'Famille', value: 'famille' },
        { label: 'Numéro CRE', value: 'numeroCRE' },
        { label: 'Statut du projet', value: 'statutProjet' },
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
          statutProjet,
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
          famille: identifiantProjet.famille,
          numeroCRE: identifiantProjet.numéroCRE,
          nomProjet,
          statutProjet: statutProjet.formatter(),
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

      const csv = await ExportCSV.toCSV({
        data,
        fields,
      });

      const fileName = `export_projet_raccordement.csv`;

      await mediator.send<AjouterStatistiqueUtilisationCommand>({
        type: 'System.Statistiques.AjouterStatistiqueUtilisation',
        data: {
          type: 'exportCsv',
          données: {
            typeExport: 'dossierRaccordement',
            utilisateur: {
              role: utilisateur.rôle.nom,
              email: utilisateur.identifiantUtilisateur.email,
            },
            nombreLignes: data.length,
            filtres: getFiltresActifs({
              appelOffre,
              periode,
              famille,
              statut,
              typeActionnariat,
            }),
          },
        },
      });

      return new Response(csv, {
        headers: {
          'content-type': 'text/csv',
          'content-disposition': `attachment; filename=${fileName}`,
        },
      });
    }),
  );
