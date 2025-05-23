import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

export const changementPuissanceRejetéProjector = async ({
  payload: { identifiantProjet, rejetéLe, rejetéPar, réponseSignée },
}: Lauréat.Puissance.ChangementPuissanceRejetéEvent) => {
  const projectionPuissance = await findProjection<Lauréat.Puissance.PuissanceEntity>(
    `puissance|${identifiantProjet}`,
  );

  if (Option.isNone(projectionPuissance)) {
    getLogger().error('Puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceRejetéProjector',
    });
    return;
  }

  if (!projectionPuissance.dateDemandeEnCours) {
    getLogger().error('Demande de changement de puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceRejetéProjector',
    });
    return;
  }

  const projectionDemandeChangementPuissance =
    await findProjection<Lauréat.Puissance.ChangementPuissanceEntity>(
      `changement-puissance|${identifiantProjet}#${projectionPuissance.dateDemandeEnCours}`,
    );

  if (Option.isNone(projectionDemandeChangementPuissance)) {
    getLogger().error('Demande de changement de puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceRejetéProjector',
    });
    return;
  }

  if (projectionDemandeChangementPuissance.demande.statut === 'information-enregistrée') {
    getLogger().error(
      `Demande non instruite car l'information a déjà été enregistrée automatiquement`,
      {
        identifiantProjet,
        fonction: 'changementPuissanceRejetéProjector',
      },
    );
    return;
  }

  await upsertProjection<Lauréat.Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${projectionPuissance.dateDemandeEnCours}`,
    {
      identifiantProjet,
      demande: {
        ...projectionDemandeChangementPuissance.demande,
        statut: Lauréat.Puissance.StatutChangementPuissance.rejeté.statut,
        rejet: {
          rejetéeLe: rejetéLe,
          rejetéePar: rejetéPar,
          réponseSignée: {
            format: réponseSignée.format,
          },
        },
      },
    },
  );

  await upsertProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    ...projectionPuissance,
    miseÀJourLe: rejetéLe,
    dateDemandeEnCours: undefined,
  });
};
