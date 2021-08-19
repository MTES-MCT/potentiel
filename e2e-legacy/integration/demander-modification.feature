# language: fr
Fonctionnalité: Demande de modification

  @porteur-projet
  Scénario: Modification de la puissance
    Etant donné que mon compte est lié aux projets suivants
      | nomProjet | classe | notifiedOn | puissance |
      | projet 1  | Classé | 1234       | 12750     |
    Lorsque je me rends sur la page qui liste mes projets
    Et que je click sur le bouton "Changer de puissance" au niveau de mon projet "projet 1"
    Alors je suis dirigé vers la page de demande de modification de "puissance"
    Lorsque je saisis la valeur "12700" dans le champ "puissance"
    Et que je valide le formulaire
    Alors on me notifie la réussite par "Votre demande a bien été prise en compte"
    Lorsque je me rends sur la page qui liste mes demandes
    Alors je vois ma demande de modification "puissance" pour mon projet "projet 1"

  @porteur-projet
  Scénario: Déposer un recours
    Etant donné que mon compte est lié aux projets suivants
      | nomProjet | classe  | notifiedOn | motifsElimination |
      | projet 1  | Eliminé | 1234       | motif             |
    Lorsque je me rends sur la page qui liste mes projets
    Et que je click sur le bouton "Faire une demande de recours" au niveau de mon projet "projet 1"
    Alors je suis dirigé vers la page de demande de modification de "recours"
    Lorsque je saisis la valeur "Ceci est un test" dans le champ "justification"
    Lorsque je choisis un fichier dans le champ pièce-jointe
    Et que je valide le formulaire
    Alors on me notifie la réussite par "Votre demande a bien été prise en compte"
    Lorsque je me rends sur la page qui liste mes demandes
    Alors je vois ma demande de modification "recours" pour mon projet "projet 1"
    Et je vois un lien pour "Télécharger la pièce-jointe" pour mon projet "projet 1"