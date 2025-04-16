import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Candidature } from '@potentiel-domain/candidature';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { loadAbandonFactory } from '../../../abandon';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
import { loadPuissanceFactory } from '../../puissance.aggregate';
import { CahierDesCharges } from '../../..';

export type EnregistrerChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.EnregistrerChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    nouvellePuissance: number;
    dateChangement: DateTime.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    raison?: string;
  }
>;

export const registerEnregistrerChangementPuissanceCommand = (loadAggregate: LoadAggregate) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<EnregistrerChangementPuissanceCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    nouvellePuissance,
    dateChangement,
    pièceJustificative,
    raison,
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

    await puissanceAggrégat.enregistrerChangement({
      identifiantProjet,
      nouvellePuissance,
      puissanceInitiale: candidature.puissance,
      identifiantUtilisateur,
      appelOffre,
      technologie: candidature.technologie,
      cahierDesCharges: cahierDesChargesChoisi,
      note: candidature.note,
      dateChangement,
      pièceJustificative,
      raison,
      estAbandonné: abandon.statut.estAccordé(),
      estAchevé: achèvement.estAchevé(),
      demandeAbandonEnCours: abandon.statut.estEnCours(),
    });
  };
  mediator.register('Lauréat.Puissance.Command.EnregistrerChangement', handler);
};
