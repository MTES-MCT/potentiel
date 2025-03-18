import { Routes } from '@potentiel-applications/routes';
import { AccèsProjetRetiréEvent } from '@potentiel-domain/utilisateur';

import { récupérerNomProjet } from './_utils/récupérerNomProjet';

export async function accèsProjetRetiréNotification({
  payload: { identifiantProjet, identifiantUtilisateur, cause },
}: AccèsProjetRetiréEvent) {
  const nomProjet = await récupérerNomProjet(identifiantProjet);
  const { BASE_URL } = process.env;
  const urlPageProjets = `${BASE_URL}${Routes.Projet.lister()}`;

  return [
    {
      templateId: 4177049,
      messageSubject: `Révocation de vos accès pour le projet ${nomProjet}`,
      recipients: [{ email: identifiantUtilisateur }],
      variables: {
        nom_projet: nomProjet,
        mes_projets_url: urlPageProjets,
        cause:
          cause === 'changement-producteur'
            ? 'Cela fait suite à un changement de producteur déclaré sur Potentiel.'
            : '',
      },
    },
  ];
}
