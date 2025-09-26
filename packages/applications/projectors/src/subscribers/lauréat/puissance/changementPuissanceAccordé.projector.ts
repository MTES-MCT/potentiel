import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

export const changementPuissanceAccordéProjector = async ({
  payload: { identifiantProjet, accordéLe, accordéPar, nouvellePuissance, réponseSignée },
}: Lauréat.Puissance.ChangementPuissanceAccordéEvent) => {
  const projectionPuissance = await findProjection<Lauréat.Puissance.PuissanceEntity>(
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
    await findProjection<Lauréat.Puissance.ChangementPuissanceEntity>(
      `changement-puissance|${identifiantProjet}#${projectionPuissance.dateDemandeEnCours}`,
    );

  if (Option.isNone(projectionDemandeChangementPuissance)) {
    getLogger().error('Demande de changement de puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceAccordéProjector',
    });
    return;
  }

  if (projectionDemandeChangementPuissance.demande.statut === 'information-enregistrée') {
    getLogger().error(
      `Demande non instruite car l'information a déjà été enregistrée automatiquement`,
      {
        identifiantProjet,
        fonction: 'changementPuissanceAccordéProjector',
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
        statut: Lauréat.Puissance.StatutChangementPuissance.accordé.statut,
        accord: {
          accordéeLe: accordéLe,
          accordéePar: accordéPar,
          réponseSignée,
        },
      },
    },
  );

  await upsertProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    ...projectionPuissance,
    miseÀJourLe: accordéLe,
    puissance: nouvellePuissance,
    dateDemandeEnCours: undefined,
  });
};
