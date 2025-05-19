import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { GetProjetAggregateRoot, Lauréat } from '@potentiel-domain/projet';

import { loadPuissanceFactory } from '../../puissance.aggregate';

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

export const registerEnregistrerChangementPuissanceCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);

  const handler: MessageHandler<EnregistrerChangementPuissanceCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    nouvellePuissance,
    dateChangement,
    pièceJustificative,
    raison,
  }) => {
    const puissanceAggrégat = await loadPuissance(identifiantProjet);
    const {
      statut,
      candidature,
      lauréat: { abandon },
    } = await getProjetAggregateRoot(identifiantProjet);

    // Après migration aggregate root, à remplacer
    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: identifiantProjet.appelOffre,
      },
    });

    // Après migration cahier des charges, à remplacer
    const cahierDesChargesChoisi =
      await mediator.send<Lauréat.ConsulterCahierDesChargesChoisiQuery>({
        type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    await puissanceAggrégat.enregistrerChangement({
      identifiantProjet,
      nouvellePuissance,
      puissanceInitiale: candidature.puissanceProductionAnnuelle,
      identifiantUtilisateur,
      appelOffre,
      technologie: candidature.technologie,
      cahierDesCharges: cahierDesChargesChoisi,
      note: candidature.noteTotale,
      dateChangement,
      pièceJustificative,
      raison,
      estAbandonné: abandon.statut.estAccordé(),
      estAchevé: statut.estAchevé(),
      demandeAbandonEnCours: abandon.statut.estEnCours(),
    });
  };
  mediator.register('Lauréat.Puissance.Command.EnregistrerChangement', handler);
};
