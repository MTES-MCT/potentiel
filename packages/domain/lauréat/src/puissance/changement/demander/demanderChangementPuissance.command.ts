import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';

import { loadAbandonFactory } from '../../../abandon';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
import { loadPuissanceFactory } from '../../puissance.aggregate';
import { CahierDesCharges } from '../../..';

export type DemanderChangementCommand = Message<
  'Lauréat.Puissance.Command.DemanderChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    puissance: number;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderChangementPuissanceCommand = (loadAggregate: LoadAggregate) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);
  const handler: MessageHandler<DemanderChangementCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    puissance,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const puissanceAggrégat = await loadPuissance(identifiantProjet);
    const abandon = await loadAbandon(identifiantProjet, false);
    const achèvement = await loadAchèvement(identifiantProjet, false);
    const candidature = await loadCandidature(identifiantProjet);

    // Après migration aggregate root, à remplacer
    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: identifiantProjet.appelOffre,
      },
    });

    // Après migration cahier des charges, à remplacer
    const cahierDesChargesChoisi =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    await puissanceAggrégat.demanderChangement({
      identifiantProjet,
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
      puissance,
      estAbandonné: abandon.statut.estAccordé(),
      demandeAbandonEnCours: abandon.statut.estEnCours(),
      estAchevé: achèvement.estAchevé(),
      appelOffre,
      technologie: candidature.technologie,
      cahierDesCharges: cahierDesChargesChoisi,
      note: candidature.note,
    });
  };
  mediator.register('Lauréat.Puissance.Command.DemanderChangement', handler);
};
