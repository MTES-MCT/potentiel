import { Puissance } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

export const changementPuissanceAccordéProjector = async ({
  payload: { identifiantProjet, accordéLe, accordéPar, nouvellePuissance, réponseSignée },
}: Puissance.ChangementPuissanceAccordéEvent) => {
  const projectionPuissance = await findProjection<Puissance.PuissanceEntity>(
    `puissance|${identifiantProjet}`,
  );

  if (Option.isNone(projectionPuissance)) {
    getLogger().error('Puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceAccordéProjector',
    });
    return;
  }

  if (!projectionPuissance.dateDemandeEnCours) {
    getLogger().error('Demande de changement de puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceAccordéProjector',
    });
    return;
  }

  const projectionDemandeChangementPuissance =
    await findProjection<Puissance.ChangementPuissanceEntity>(
      `changement-puissance|${identifiantProjet}#${projectionPuissance.dateDemandeEnCours}`,
    );

  if (Option.isNone(projectionDemandeChangementPuissance)) {
    getLogger().error('Demande de changement de puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceAccordéProjector',
    });
    return;
  }

  await upsertProjection<Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${projectionPuissance.dateDemandeEnCours}`,
    {
      identifiantProjet,
      demande: {
        ...projectionDemandeChangementPuissance.demande,
        statut: Puissance.StatutChangementPuissance.accordé.statut,
        accord: {
          accordéeLe: accordéLe,
          accordéePar: accordéPar,
          réponseSignée: {
            format: réponseSignée.format,
          },
        },
      },
    },
  );

  await upsertProjection<Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    ...projectionPuissance,
    miseÀJourLe: accordéLe,
    puissance: nouvellePuissance,
    dateDemandeEnCours: undefined,
  });
};
