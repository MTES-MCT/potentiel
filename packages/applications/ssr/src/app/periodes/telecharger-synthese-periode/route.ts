import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { SynthèsePériode } from '@potentiel-applications/document-builder';
import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { Candidature } from '@potentiel-domain/projet';
import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const GET = async (request: Request) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const logger = getLogger();
      const { searchParams } = new URL(request.url);

      const rôleUtilisateur = utilisateur.rôle;

      const canExporterSynthèse = rôleUtilisateur.aLaPermission('période.consulterSynthèse');

      if (!canExporterSynthèse) {
        throw new AccèsFonctionnalitéRefuséError('période.consulterSynthèse', rôleUtilisateur.nom);
      }

      const appelOffre = searchParams.get('appelOffre') ?? undefined;
      const periode = searchParams.get('periode') ?? undefined;

      if (!appelOffre || !periode) {
        return notFound();
      }

      const candidatsPériode = await mediator.send<Candidature.ListerCandidaturesQuery>({
        type: 'Candidature.Query.ListerCandidatures',
        data: {
          appelOffre: [appelOffre],
          période: periode,
        },
      });

      const lauréats = candidatsPériode.items.filter((c) => c.statut.estClassé());

      const appelOffreData = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: { identifiantAppelOffre: appelOffre },
      });

      if (Option.isNone(appelOffreData)) {
        return notFound();
      }

      const périodeData = appelOffreData.periodes.find((p) => p.id === periode);

      if (!périodeData) {
        return notFound();
      }

      const LauréatsPrixMoyenPondéré =
        lauréats.reduce((acc, c) => acc + c.prixReference, 0) / lauréats.length;

      const data: SynthèsePériode.DonnéesDocument = {
        dateCourrier: new Date().toISOString(),
        période: {
          cycleAppelOffres: appelOffreData.cycleAppelOffre,
          puissanceRecherchée: '', // TODO : ajouter
          titre: périodeData.title,
          titreAppelOffres: appelOffreData.title,
          unitéPuissance: périodeData.unitéPuissance || appelOffreData.unitePuissance.toString(),
        },
        lauréats: lauréats.map((lauréat) => ({
          nom: lauréat.nomCandidat,
          nomProjet: lauréat.nomProjet,
          puissance: lauréat.puissance.toLocaleString(),
          commune: lauréat.localité.commune,
          département: lauréat.localité.département,
          région: lauréat.localité.région,
        })),
        synthèse: {
          candidats: {
            nombre: candidatsPériode.items.length.toString(),
            puissanceCumulée: candidatsPériode.items
              .reduce((acc, c) => acc + c.puissance, 0)
              .toLocaleString(),
          },
          lauréats: {
            nombre: lauréats.length.toString(),
            puissanceCumulée: lauréats.reduce((acc, c) => acc + c.puissance, 0).toLocaleString(),
            prixMoyenPondéré: LauréatsPrixMoyenPondéré.toLocaleString(),
          },
        },
      };

      const document = await SynthèsePériode.buildDocument(data);

      if (!document) {
        logger.warn(`La synthèse de période n'a pas pu être générée`, { appelOffre, periode });
        return notFound();
      }

      return new Response(document, {
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': 'inline',
        },
      });
    }),
  );
