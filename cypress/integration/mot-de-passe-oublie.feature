# language: fr
Fonctionnalité: Utilisateur, je peux demander un nouveau mot de passe si je l'ai oublié

  @porteur-projet
  Scénario: Le porteur de projet a oublié son mot de passe
    Etant donné que je suis déconnecté
    Lorsque je vais sur la page d'oubli de mot de passe
    Et que je saisis mon email dans le champ email
    Et que je valide le formulaire
    Alors on me notifie la réussite par "Si l'adresse saisie correspond bien à un compte Potentiel, vous recevrez un courrier électronique avec des instructions pour choisir un nouveau mot de passe."
    Lorsque je clique sur le lien de récupération de mot de passe que je reçois par mail
    Alors je suis dirigé vers une page de changement de mot de passe
    Lorsque je saisis le nouveau mot de passe "hello" dans les deux champs
    Et que je valide le formulaire
    Alors je suis dirigé vers la page d'identification
    Et on me notifie la réussite par "Votre mot de passe a bien été mis à jour. Vous pouvez à présenter vous identifier."
    Lorsque je saisis mon email dans le champ email
    Et que je saisis "hello" dans le champ mot de passe
    Et que je valide le formulaire
    Alors je suis dirigé vers la page qui liste mes projets



