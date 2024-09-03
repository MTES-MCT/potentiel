import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { Candidature } from '@potentiel-domain/candidature';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Éliminé } from '@potentiel-domain/elimine';
import { Lauréat } from '@potentiel-domain/laureat';

import { buildCertificate } from './buildCertificate';

export type SubscriptionEvent = Éliminé.ÉliminéNotifié | Lauréat.LauréatNotifié;

export type Execute = Message<'System.Candidature.Attestation.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const logger = getLogger('System.Candidature.Attestation.Saga.Execute');
    const {
      payload: {
        identifiantProjet,
        attestation: { format },
        notifiéLe,
        notifiéPar,
      },
    } = event;
    switch (event.type) {
      case 'ÉliminéNotifié-V1':
      case 'LauréatNotifié-V1':
        const content = await generateCertificate(identifiantProjet, notifiéPar);
        if (!content) {
          logger.warn(`Impossible de générer l'attestation du projet ${identifiantProjet}`);
          return;
        }
        const attestation = DocumentProjet.convertirEnValueType(
          identifiantProjet,
          'attestation',
          notifiéLe,
          format,
        );

        await mediator.send<EnregistrerDocumentProjetCommand>({
          type: 'Document.Command.EnregistrerDocumentProjet',
          data: {
            content,
            documentProjet: attestation,
          },
        });

        break;
    }
  };
  mediator.register('System.Candidature.Attestation.Saga.Execute', handler);
};

const generateCertificate = async (identifiantProjet: string, identifiantUtilisateur: string) => {
  const logger = getLogger('System.Candidature.Attestation.Saga.Execute');
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(candidature)) {
    logger.warn(`Candidature non trouvée`, { identifiantProjet });
    return null;
  }

  const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: candidature.identifiantProjet.appelOffre },
  });

  if (Option.isNone(appelOffres)) {
    logger.warn(`Appel d'offres non trouvée`, { identifiantProjet });
    return null;
  }

  const période = appelOffres.periodes.find((x) => x.id === candidature.identifiantProjet.période);
  if (!période) {
    logger.warn(`Période non trouvée`, { identifiantProjet });
    return null;
  }
  if (période.type && période.type !== 'notified') {
    logger.warn(`Période non notifiée`, { identifiantProjet, période });
    return null;
  }

  const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
    type: 'Utilisateur.Query.ConsulterUtilisateur',
    data: {
      identifiantUtilisateur,
    },
  });
  if (Option.isNone(utilisateur)) {
    logger.warn(`Utilisateur non trouvé`, { identifiantProjet, identifiantUtilisateur });
    return null;
  }
  const famille = période.familles.find((x) => x.id === candidature.identifiantProjet.famille);
  const content = await buildCertificate({
    template: période.certificateTemplate,
    validateur: {
      fullName: utilisateur.nomComplet,
      fonction: utilisateur.fonction,
    },
    data: {
      appelOffre: appelOffres,
      période,
      famille,

      isClasse: candidature.statut.estClassé(),
      potentielId: candidature.identifiantProjet.formatter().replaceAll('#', '-'),

      nomProjet: candidature.nomProjet,
      adresseProjet: [candidature.localité.adresse1, candidature.localité.adresse2]
        .filter(Boolean)
        .join('\n'),
      codePostalProjet: candidature.localité.codePostal,
      communeProjet: candidature.localité.commune,

      nomCandidat: candidature.nomCandidat,
      nomRepresentantLegal: candidature.nomReprésentantLégal,
      email: candidature.emailContact,

      evaluationCarbone: candidature.evaluationCarboneSimplifiée,
      prixReference: candidature.prixReference,
      puissance: candidature.puissanceProductionAnnuelle,
      technologie: candidature.technologie.type,
      engagementFournitureDePuissanceAlaPointe: candidature.puissanceALaPointe,
      isFinancementParticipatif: candidature.financementParticipatif,

      motifsElimination: candidature.motifÉlimination,

      notifiedOn: 0, // TODO
      isInvestissementParticipatif: false, // TODO
      // actionnariat:
      // désignationCatégorie
    },
  });
  return content;
};
