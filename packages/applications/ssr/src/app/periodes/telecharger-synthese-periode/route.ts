import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import { SynthèsePériode } from '@potentiel-applications/document-builder';
import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { Email } from '@potentiel-domain/common';
import type { Candidature, Lauréat } from '@potentiel-domain/projet';
import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getSearchParamsValues } from '@/app/_helpers';
import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatNumberForDocument } from '../helpers/formatNumbersForDocument';
import { getPériodePrixMoyenPondéré } from '../helpers/getPériodePrixMoyenPondéré';

type GetProjetsLauréatsDeLaPériodeParTypeProps = {
  email: Email.RawType;
  appelOffre: string;
  periode: string;
  type: SynthèsePériode.DonnéesDocument['typeDeSynthèse'];
};

type ProjetLauréatDeLaPériode = {
  nom: string;
  nomProjet: string;
  commune: string;
  département: string;
  région: string;
  puissance: number;
  unitéPuissance: string;
  prixReference: number;
};

const getProjetsLauréatsDeLaPériodeParType = async ({
  email,
  appelOffre,
  periode,
  type,
}: GetProjetsLauréatsDeLaPériodeParTypeProps) =>
  match(type)
    .returnType<Promise<Array<ProjetLauréatDeLaPériode>>>()
    .with('laureat', async () => {
      const lauréats = await mediator.send<Lauréat.ListerLauréatQuery>({
        type: 'Lauréat.Query.ListerLauréat',
        data: {
          appelOffre: [appelOffre],
          utilisateur: email,
          periode: periode,
        },
      });

      return [...lauréats.items]
        .sort(
          (a, b) =>
            a.localité.région.localeCompare(b.localité.région) ||
            a.localité.département.localeCompare(b.localité.département),
        )
        .map(
          ({
            nomProjet,
            nomCandidat,
            localité: { commune, département, région },
            puissance: { valeur, unité },
            prixReference,
          }) => ({
            nomProjet,
            nom: nomCandidat,
            commune,
            département,
            région,
            puissance: valeur,
            unitéPuissance: unité.formatter(),
            prixReference,
          }),
        );
    })
    .with('candidature', async () => {
      const projets = await mediator.send<Candidature.ListerCandidaturesQuery>({
        type: 'Candidature.Query.ListerCandidatures',
        data: {
          appelOffre: [appelOffre],
          période: periode,
        },
      });

      return projets.items
        .filter((candidat) => candidat.statut.estClassé())
        .sort(
          (a, b) =>
            a.localité.région.localeCompare(b.localité.région) ||
            a.localité.département.localeCompare(b.localité.département),
        )
        .map(
          ({
            nomCandidat,
            nomProjet,
            localité: { commune, département, région },
            puissance,
            unitéPuissance,
            prixReference,
          }) => ({
            nom: nomCandidat,
            nomProjet,
            commune,
            département,
            région,
            puissance,
            unitéPuissance: unitéPuissance.formatter(),
            prixReference,
          }),
        );
    })
    .exhaustive();

export const GET = async (request: Request) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const logger = getLogger();

      const rôleUtilisateur = utilisateur.rôle;

      const canExporterSynthèse = rôleUtilisateur.aLaPermission('période.consulterSynthèse');

      if (!canExporterSynthèse) {
        throw new AccèsFonctionnalitéRefuséError('période.consulterSynthèse', rôleUtilisateur.nom);
      }
      const { searchParams } = new URL(request.url);

      const { appelOffre, periode, type } = getSearchParamsValues({
        searchParams,
        config: {
          appelOffre: 'single',
          periode: 'single',
          type: ['laureat', 'candidature'] as const,
        },
      });

      if (!appelOffre || !periode || !type) {
        return notFound();
      }

      const candidatsPériode = await mediator.send<Candidature.ListerCandidaturesQuery>({
        type: 'Candidature.Query.ListerCandidatures',
        data: {
          appelOffre: [appelOffre],
          période: periode,
        },
      });

      const projetsLauréatsDeLaPériode = await getProjetsLauréatsDeLaPériodeParType({
        email: utilisateur.identifiantUtilisateur.email,
        appelOffre,
        periode,
        type,
      });

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
          puissanceRecherchée: `${périodeData.puissanceAppelée}`,
          titre: périodeData.title,
          titreAppelOffres: appelOffreData.title,
          unitéPuissance:
            périodeData.unitéPuissance ??
            (typeof appelOffreData.unitePuissance === 'string'
              ? appelOffreData.unitePuissance
              : 'MW(c)'),
        },
        lauréats: projetsLauréatsDeLaPériode.map((lauréat) => ({
          ...lauréat,
          puissance: formatNumberForDocument(lauréat.puissance),
        })),
        synthèse: {
          candidats: {
            nombre: candidatsPériode.items.length.toString(),
            puissanceCumulée: formatNumberForDocument(
              candidatsPériode.items.reduce((acc, c) => acc + c.puissance, 0),
            ),
          },
          lauréats: {
            nombre: projetsLauréatsDeLaPériode.length.toString(),
            puissanceCumulée: formatNumberForDocument(
              projetsLauréatsDeLaPériode.reduce((acc, c) => acc + Number(c.puissance), 0),
            ),
            prixMoyenPondéré: formatNumberForDocument(
              getPériodePrixMoyenPondéré(
                projetsLauréatsDeLaPériode.map(({ puissance, prixReference }) => ({
                  puissance,
                  prix: prixReference,
                })),
              ),
            ),
          },
        },
        typeDeSynthèse: type,
      };

      const document = await SynthèsePériode.buildDocument(data);

      if (!document) {
        logger.warn(`La synthèse de période n'a pas pu être générée`, {
          appelOffre: appelOffre,
          periode: periode,
        });
        return notFound();
      }

      return new Response(document, {
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': `inline; filename="Synthèse ${appelOffre} P${periode}.pdf"`,
        },
      });
    }),
  );
