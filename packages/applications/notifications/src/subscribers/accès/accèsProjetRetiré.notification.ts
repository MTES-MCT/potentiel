import { Routes } from '@potentiel-applications/routes';
import { Accès } from '@potentiel-domain/projet';

import { récupérerCandidature } from '../../_utils/récupérerCandidature';
import { EmailPayload } from '../../sendEmail';

export async function accèsProjetRetiréNotification({
  payload: { identifiantProjet, identifiantsUtilisateur, cause },
}: Accès.AccèsProjetRetiréEvent): Promise<Array<EmailPayload>> {
  const { nom } = await récupérerCandidature(identifiantProjet);
  const { BASE_URL } = process.env;
  const urlPageProjets = `${BASE_URL}${Routes.Projet.lister()}`;

  return [
    {
      templateId: 4177049,
      messageSubject: `Potentiel - Révocation de vos accès pour le projet ${nom}`,
      recipients: identifiantsUtilisateur.map((identifiantUtilisateur) => ({
        email: identifiantUtilisateur,
      })),
      variables: {
        nom_projet: nom,
        mes_projets_url: urlPageProjets,
        cause:
          cause === 'changement-producteur'
            ? 'Cela fait suite à un changement de producteur déclaré sur Potentiel.'
            : '',
      },
    },
  ];
}
