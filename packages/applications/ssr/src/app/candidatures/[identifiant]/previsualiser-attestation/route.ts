import { notFound } from 'next/navigation';
import { mediator } from 'mediateur';

import {
  AccèsFonctionnalitéRefuséError,
  ConsulterUtilisateurQuery,
} from '@potentiel-domain/utilisateur';
import { buildCertificate } from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DateTime } from '@potentiel-domain/common';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { getPériodeAppelOffres, getCandidature } from '@/app/_helpers';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const logger = getLogger();

      const identifiantProjet = decodeParameter(identifiant);

      const rôleUtilisateur = utilisateur.rôle;

      const canPreviewAttestation = rôleUtilisateur.aLaPermission(
        'candidature.attestation.prévisualiser',
      );

      if (!canPreviewAttestation) {
        throw new AccèsFonctionnalitéRefuséError(
          'candidature.attestation.prévisualiser',
          rôleUtilisateur.nom,
        );
      }

      const candidature = await getCandidature(identifiantProjet);

      const notifiéLe = candidature.notification?.notifiéeLe ?? DateTime.now();
      const notifiéPar =
        candidature.notification?.notifiéePar ?? utilisateur.identifiantUtilisateur;

      const { appelOffres, période } = await getPériodeAppelOffres(
        candidature.identifiantProjet.formatter(),
      );

      const modèleAttestationNonDisponible = période.type === 'legacy';

      if (modèleAttestationNonDisponible) {
        logger.warn(`Le modèle d'attestation n'est pas disponible`, {
          identifiantProjet,
          période,
        });
        return notFound();
      }

      const user = await mediator.send<ConsulterUtilisateurQuery>({
        type: 'Utilisateur.Query.ConsulterUtilisateur',
        data: {
          identifiantUtilisateur: notifiéPar.formatter(),
        },
      });

      if (Option.isNone(user)) {
        logger.warn(`Utilisateur non trouvé`, {
          identifiantProjet,
          identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
        });
        return notFound();
      }

      const validateur = candidature.notification?.validateur ?? {
        fonction: Option.match(user.fonction)
          .some((fonction) => fonction)
          .none(() => 'Fonction du DGEC Validateur'),
        nomComplet: Option.match(user.nomComplet)
          .some((nom) => nom)
          .none(() => 'Nom du DGEC Validateur'),
      };

      const certificate = await buildCertificate({
        appelOffre: appelOffres,
        période,
        validateur,
        candidature,
        notifiéLe: notifiéLe.formatter(),
      });

      if (!certificate) {
        logger.warn(`L'attestation n'a pu être générée`, { identifiantProjet });
        return notFound();
      }

      return new Response(certificate, {
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': 'inline',
        },
      });
    }),
  );
