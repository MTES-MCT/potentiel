# language: fr
Fonctionnalité: Je peux donner les droits à un projet à un autre utilisateur

  @porteur-projet
  Scénario: Le porteur de projet invite un autre porteur de projet qui a un compte
    Etant donné que mon compte est lié aux projets suivants
      | nomProjet | classe  | notifiedOn | motifsElimination |
      | projet 1  | Eliminé | 1234       | motif             |
    Et un autre porteur de projet inscrit avec l'adresse "autre@porteur.test"
    Lorsque je me rends sur la page du projet "projet 1"
    Et que j'ouvre la section "Contact"
    Et que je click sur le bouton "Donner accès à un autre utilisateur"
    Et que je saisis la valeur "autre@porteur.test" dans le champ "email"
    Et que je valide le formulaire
    Alors on me notifie la réussite par "Une invitation a bien été envoyée à autre@porteur.test"
    Et "autre@porteur.test" reçoit un mail de notification avec un lien vers le projet "projet 1"
    Et "autre@porteur.test" a accès au projet "projet 1"


  @porteur-projet
  Scénario: Le porteur de projet invite un email qui n'a pas encore de compte
    Etant donné que mon compte est lié aux projets suivants
      | nomProjet | classe  | notifiedOn | motifsElimination |
      | projet 1  | Eliminé | 1234       | motif             |
    Lorsque je me rends sur la page du projet "projet 1"
    Et que j'ouvre la section "Contact"
    Et que je click sur le bouton "Donner accès à un autre utilisateur"
    Et que je saisis la valeur "inexistant@porteur.test" dans le champ "email"
    Et que je valide le formulaire
    Alors on me notifie la réussite par "Une invitation a bien été envoyée à inexistant@porteur.test"
    Et "inexistant@porteur.test" reçoit un mail de notification avec un lien d'invitation
    Lorsque je me déconnecte
    Et que je click sur le lien d'invitation reçu dans le mail de notification
    Alors je suis dirigé vers la page de création de compte
    Lorsque je remplis mon mot de passe
    Et que je valide le formulaire
    Alors je suis dirigé vers la page qui liste mes projets
    Et le projet "projet 1" se trouve dans ma liste de projets