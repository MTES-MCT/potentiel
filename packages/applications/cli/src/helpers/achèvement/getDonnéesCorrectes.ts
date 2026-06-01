import { IdentifiantProjet } from '@potentiel-domain/projet';
import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';

export const getDonnéesCorrectes = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const projet = await ProjetAdapter.getProjetAggregateRootAdapter(
    IdentifiantProjet.convertirEnValueType(identifiantProjet),
  );

  const datePrévisionnelleCorrecte =
    await projet.lauréat.achèvement.getDateAchèvementPrévisionnelCalculée({
      type: 'notification',
    });

  const createdAt = projet.lauréat.notifiéLe.ajouterNombreDeMillisecondes(500).formatter();

  return { datePrévisionnelleCorrecte, createdAt };
};
