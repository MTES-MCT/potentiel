import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { GetProjetAggregateRoot, Lauréat } from '@potentiel-domain/projet';

import { loadAbandonFactory } from '../../../abandon';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
import { loadPuissanceFactory } from '../../puissance.aggregate';

export type DemanderChangementCommand = Message<
  'Lauréat.Puissance.Command.DemanderChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    nouvellePuissance: number;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderChangementPuissanceCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const handler: MessageHandler<DemanderChangementCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    nouvellePuissance,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const puissanceAggrégat = await loadPuissance(identifiantProjet);
    const abandon = await loadAbandon(identifiantProjet, false);
    const achèvement = await loadAchèvement(identifiantProjet, false);
    const { candidature } = await getProjetAggregateRoot(identifiantProjet);

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

    await puissanceAggrégat.demanderChangement({
      identifiantProjet,
      nouvellePuissance,
      puissanceInitiale: candidature.puissanceProductionAnnuelle,
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
      estAbandonné: abandon.statut.estAccordé(),
      demandeAbandonEnCours: abandon.statut.estEnCours(),
      estAchevé: achèvement.estAchevé(),
      appelOffre,
      technologie: candidature.technologie,
      cahierDesCharges: cahierDesChargesChoisi,
      note: candidature.noteTotale,
    });
  };
  mediator.register('Lauréat.Puissance.Command.DemanderChangement', handler);
};
