# language: fr
Fonctionnalité: Demande de modification

  @porteur-projet
  Scénario: Modification du producteur
    Etant donné que mon compte est lié aux projets suivants
      | nomProjet | classe | notifiedOn | puissance |
      | projet 1  | Classé | 1234       | 12750     |
    Lorsque je me rends sur la page qui liste mes projets
    Et que je click sur le bouton "Changer de puissance" au niveau de mon projet "projet 1"
    Alors je suis dirigé vers la page de demande de modification de "puissance"
    Lorsque je saisis la valeur "12700" dans le champ "puissance"
    Et que je valide le formulaire
    Alors je suis redirigé vers la page qui liste mes demandes
    Et me notifie la réussite par "Votre demande a bien été prise en compte"
    Et je vois ma demande de modification "puissance" pour mon projet "projet 1"

