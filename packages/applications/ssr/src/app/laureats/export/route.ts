import { mediator } from 'mediateur';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';
import { formatDateForDocument } from '@potentiel-applications/document-builder';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const GET = async (request: Request) =>
  apiAction(async () =>
    withUtilisateur(async (utilisateur) => {
      const { searchParams } = new URL(request.url);

      const appelOffre = searchParams.getAll('appelOffre') ?? undefined;
      const periode = searchParams.get('periode') ?? undefined;
      const famille = searchParams.get('famille') ?? undefined;
      const statut = searchParams.get('statut') ?? undefined;
      const typeActionnariat = searchParams.getAll('typeActionnariat') ?? undefined;

      const lauréatEnrichiList = await mediator.send<Lauréat.ListerLauréatEnrichiQuery>({
        type: 'Lauréat.Query.ListerLauréatEnrichi',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          appelOffre,
          famille,
          periode,
          statut: statut
            ? Lauréat.StatutLauréat.convertirEnValueType(statut).formatter()
            : undefined,
          typeActionnariat: typeActionnariat.length
            ? typeActionnariat.map((value) =>
                Candidature.TypeActionnariat.convertirEnValueType(value).formatter(),
              )
            : undefined,
        },
      });

      const csv = await ExportCSV.toCSV<
        Record<keyof Lauréat.LauréatEnrichiListItemReadModel, string | number | undefined>
      >({
        fields: [
          { value: 'identifiantProjet', label: 'Identifiant projet' },
          { value: 'appelOffre', label: "Appel d'offres" },
          { value: 'période', label: 'Période' },
          { value: 'famille', label: 'Famille' },
          { value: 'numéroCRE', label: 'Numéro CRE' },
          { value: 'nomProjet', label: 'Nom du projet' },
          { value: 'statut', label: 'Statut du projet' },
          { value: 'adresse1', label: 'Adresse 1' },
          { value: 'adresse2', label: 'Adresse 2' },
          { value: 'commune', label: 'Commune' },
          { value: 'codePostal', label: 'Code postal' },
          { value: 'département', label: 'Département' },
          { value: 'région', label: 'Région' },
          { value: 'actionnaire', label: 'Actionnaire' },
          { value: 'typeActionnariat', label: "Type d'actionnariat" },
          { value: 'raisonSocialeGestionnaireRéseau', label: 'Gestionnaire réseau' },
          { value: 'dateAchèvementPrévisionnelle', label: "Date d'achèvement prévisionnelle" },
          { value: 'dateAchèvementRéelle', label: "Date d'achèvement réelle" },
          { value: 'prixReference', label: 'Prix de référence' },
          { value: 'puissance', label: 'Puissance installée' },
          { value: 'unitéPuissance', label: 'Unité de puissance' },
          { value: 'technologieÉolien', label: 'Technologie (éolien)' },
          { value: 'diamètreRotorEnMètres', label: 'Diamètre rotor (m)' },
          { value: 'hauteurBoutDePâleEnMètres', label: 'Hauteur bout de pâle (m)' },
          { value: 'installationRenouvellée', label: 'Installation renouvelée' },
          { value: 'nombreDAérogénérateurs', label: "Nombre d'aérogénérateurs" },
          {
            value: 'puissanceUnitaireDesAérogénérateurs',
            label: 'Puissance unitaire des aérogénérateurs',
          },
        ],
        data: lauréatEnrichiList.items.map((item) => ({
          ...item,
          identifiantProjet: item.identifiantProjet.formatter(),
          statut: item.statut.formatter(),
          unitéPuissance: item.unitéPuissance.formatter(),
          typeActionnariat: item.typeActionnariat?.formatter(),
          dateAchèvementPrévisionnelle: formatDateForDocument(
            item.dateAchèvementPrévisionnelle?.date,
          ),
          dateAchèvementRéelle: item.dateAchèvementRéelle
            ? formatDateForDocument(item.dateAchèvementRéelle.date)
            : '',
        })),
      });

      const fileName = `export_laureats.csv`;

      return new Response(csv, {
        headers: {
          'content-type': 'text/csv',
          'content-disposition': `attachment; filename=${fileName}`,
        },
      });
    }),
  );
