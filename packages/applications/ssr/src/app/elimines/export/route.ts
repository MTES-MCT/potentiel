import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';
import { AjouterStatistiqueUtilisationCommand } from '@potentiel-domain/statistiques-utilisation';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getFiltresActifs } from '@/app/_helpers/getFiltresActifs';
import { getNatureDeLExploitationTypeLabel, getTypologieInstallationLabel } from '@/app/_helpers';

export const GET = async (request: Request) =>
  apiAction(async () =>
    withUtilisateur(async (utilisateur) => {
      const { searchParams } = new URL(request.url);

      const appelOffre = searchParams.getAll('appelOffre') ?? undefined;
      const periode = searchParams.get('periode') ?? undefined;
      const famille = searchParams.get('famille') ?? undefined;
      const typeActionnariat = searchParams.getAll('typeActionnariat') ?? undefined;
      const identifiantProjet = searchParams.get('identifiantProjet') ?? undefined;

      const éliminéEnrichiList = await mediator.send<Éliminé.ListerÉliminéEnrichiQuery>({
        type: 'Éliminé.Query.ListerÉliminéEnrichi',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          appelOffre,
          famille,
          periode,
          identifiantProjet: identifiantProjet
            ? IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter()
            : undefined,
          typeActionnariat: typeActionnariat.length
            ? typeActionnariat.map((value) =>
                Candidature.TypeActionnariat.convertirEnValueType(value).formatter(),
              )
            : undefined,
        },
      });

      const csv = await ExportCSV.toCSV<
        Record<keyof Éliminé.ÉliminéEnrichiListItemReadModel, string | number | undefined>
      >({
        fields: [
          { value: 'identifiantProjet', label: 'Identifiant projet' },
          { value: 'appelOffre', label: "Appel d'offres" },
          { value: 'période', label: 'Période' },
          { value: 'famille', label: 'Famille' },
          { value: 'numéroCRE', label: 'Numéro CRE' },
          { value: 'nomProjet', label: 'Nom du projet' },
          { value: 'adresse1', label: 'Adresse 1' },
          { value: 'adresse2', label: 'Adresse 2' },
          { value: 'commune', label: 'Commune' },
          { value: 'codePostal', label: 'Code postal' },
          { value: 'département', label: 'Département' },
          { value: 'région', label: 'Région' },
          { value: 'actionnaire', label: 'Actionnaire' },
          { value: 'typeActionnariat', label: "Type d'actionnariat" },
          { value: 'prixReference', label: 'Prix de référence' },
          { value: 'puissance', label: 'Puissance installée' },
          { value: 'puissanceDeSite', label: 'Puissance de site' },
          { value: 'unitéPuissance', label: 'Unité de puissance' },
          {
            value: 'coefficientKChoisi',
            label: 'Coefficient K choisi',
          },
          {
            value: 'numéroAutorisationDUrbanisme',
            label: "Autorisation d'urbanisme",
          },
          {
            value: 'installateur',
            label: 'Installateur',
          },
          {
            value: 'installationAvecDispositifDeStockage',
            label: 'Installation avec dispositif de stockage',
          },
          {
            value: 'capacitéDuDispositifDeStockageEnKWh',
            label: 'Capacité du dispositif de stockage (kWh)',
          },

          {
            value: 'puissanceDuDispositifDeStockageEnKW',
            label: 'Puissance du dispositif de stockage (kW)',
          },
          {
            value: 'typologieInstallation',
            label: 'Typologie de l’installation',
          },
          {
            value: 'typeNatureDeLExploitation',
            label: "Type de nature de l'exploitation",
          },
          {
            value: 'tauxPrévisionnelACI',
            label: 'Taux prévisionnel ACI (%)',
          },
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
        data: éliminéEnrichiList.items.map((item) => ({
          ...item,
          identifiantProjet: item.identifiantProjet.formatter(),
          unitéPuissance: item.unitéPuissance.formatter(),
          typeActionnariat: item.typeActionnariat?.formatter(),

          coefficientKChoisi:
            item.coefficientKChoisi === undefined
              ? undefined
              : item.coefficientKChoisi
                ? 'Oui'
                : 'Non',
          installationAvecDispositifDeStockage:
            item.installationAvecDispositifDeStockage === undefined
              ? undefined
              : item.installationAvecDispositifDeStockage
                ? 'Oui'
                : 'Non',
          puissanceDuDispositifDeStockageEnKW: item.puissanceDuDispositifDeStockageEnKW,
          capacitéDuDispositifDeStockageEnKWh: item.capacitéDuDispositifDeStockageEnKWh,
          typologieInstallation: item.typologieInstallation
            ?.map(({ typologie }) => getTypologieInstallationLabel(typologie))
            .join(', '),
          typeNatureDeLExploitation: item.typeNatureDeLExploitation
            ? getNatureDeLExploitationTypeLabel(item.typeNatureDeLExploitation.type)
            : undefined,
        })),
      });

      await mediator.send<AjouterStatistiqueUtilisationCommand>({
        type: 'System.Statistiques.AjouterStatistiqueUtilisation',
        data: {
          type: 'exportCsv',
          données: {
            typeExport: 'éliminéEnrichi',
            utilisateur: {
              role: utilisateur.rôle.nom,
              email: utilisateur.identifiantUtilisateur.email,
            },
            nombreLignes: éliminéEnrichiList.items.length,
            filtres: getFiltresActifs({
              appelOffre,
              periode,
              famille,
              typeActionnariat,
            }),
          },
        },
      });

      const fileName = `export_elimines.csv`;

      return new Response(csv, {
        headers: {
          'content-type': 'text/csv',
          'content-disposition': `attachment; filename=${fileName}`,
        },
      });
    }),
  );
