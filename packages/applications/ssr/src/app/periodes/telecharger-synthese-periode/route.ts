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
import { formatNumberForDocument } from '../helpers/formatNumbersForDocument';
import { getPériodePrixMoyenPondéré } from '../helpers/getPériodePrixMoyenPondéré';

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

      const candidatsLauréatsPériode = candidatsPériode.items.sort(
        (a, b) =>
          a.localité.région.localeCompare(b.localité.région) ||
          a.localité.département.localeCompare(b.localité.département),
      );

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

      const data: SynthèsePériode.DonnéesDocument = {
        dateCourrier: new Date().toISOString(),
        période: {
          cycleAppelOffres: appelOffreData.cycleAppelOffre,
          puissanceRecherchée: '', // TODO : ajouter
          titre: périodeData.title,
          titreAppelOffres: appelOffreData.title,
        },
        lauréats: candidatsLauréatsPériode.map((lauréat) => ({
          nom: lauréat.nomCandidat,
          nomProjet: lauréat.nomProjet,
          puissance: formatNumberForDocument(lauréat.puissance),
          commune: lauréat.localité.commune,
          département: lauréat.localité.département,
          région: lauréat.localité.région,
        })),
        synthèse: {
          candidats: {
            nombre: candidatsPériode.items.length.toString(),
            puissanceCumulée: formatNumberForDocument(
              candidatsPériode.items.reduce((acc, c) => acc + c.puissance, 0),
            ),
          },
          lauréats: {
            nombre: candidatsLauréatsPériode.length.toString(),
            puissanceCumulée: formatNumberForDocument(
              candidatsLauréatsPériode.reduce((acc, c) => acc + c.puissance, 0),
            ),
            prixMoyenPondéré: formatNumberForDocument(
              getPériodePrixMoyenPondéré(
                candidatsLauréatsPériode.map((l) => ({
                  puissance: l.puissance,
                  prix: l.prixReference,
                })),
              ),
            ),
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
