import { mediator } from 'mediateur';

import type { Candidature } from '@potentiel-domain/projet';
import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';
import { ExportCSV } from '@potentiel-libraries/csv';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

type DétailCandidatureCSV = {
  appelOffres: string;
  période: string;
  nomCandidat: string;
  nomProjet: string;
  statut: Candidature.StatutCandidature.RawType;
  puissance: string;
  unitéPuissance: Candidature.UnitéPuissance.RawType;
  commune: string;
  département: string;
  région: string;
};

export const GET = async (request: Request) =>
  apiAction(async () =>
    withUtilisateur(async (utilisateur) => {
      const utilisateurPeutExporterLesCandidats = utilisateur.rôle.aLaPermission(
        'candidature.exporterListe',
      );

      if (!utilisateurPeutExporterLesCandidats) {
        throw new AccèsFonctionnalitéRefuséError('candidature.exporterListe', utilisateur.rôle.nom);
      }
      const { searchParams } = new URL(request.url);

      const appelOffre = searchParams.getAll('appelOffre') ?? undefined;
      const période = searchParams.get('periode') ?? undefined;
      const famille = searchParams.get('famille') ?? undefined;

      const candidaturesNonNotifiées = await mediator.send<Candidature.ListerCandidaturesQuery>({
        type: 'Candidature.Query.ListerCandidatures',
        data: {
          appelOffre,
          famille,
          période,
          estNotifiée: false,
        },
      });

      const data: DétailCandidatureCSV[] = candidaturesNonNotifiées.items.map((item) => ({
        ...item,
        statut: item.statut.formatter(),
        unitéPuissance: item.unitéPuissance.formatter(),
        commune: item.localité.commune,
        département: item.localité.département,
        région: item.localité.région,
        puissance: item.puissance.toLocaleString(),
      }));

      const csv = await ExportCSV.toCSV<DétailCandidatureCSV>({
        fields: [
          { value: 'appelOffres', label: "Appel d'offres" },
          { value: 'période', label: 'Période' },
          { value: 'nomCandidat', label: 'Nom du candidat' },
          { value: 'nomProjet', label: 'Nom du projet' },
          { value: 'statut', label: 'Statut' },
          { value: 'puissance', label: 'Puissance' },
          { value: 'unitéPuissance', label: 'Unité de puissance' },
          { value: 'commune', label: 'Commune' },
          { value: 'département', label: 'Département' },
          { value: 'région', label: 'Région' },
        ],

        data,
      });

      const fileName = `export_candidatures_non_notifiees.csv`;

      return new Response(csv, {
        headers: {
          'content-type': 'text/csv',
          'content-disposition': `attachment; filename=${fileName}`,
        },
      });
    }),
  );
