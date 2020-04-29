# language: fr
Fonctionnalité: Porteur de projet, je reçois un lien d'activation dans mon mail de notification

  @porteur-projet
  Scénario: Le porteur de projet a déjà un compte avec cet email mais n'est pas identifié
    Etant donné que je suis déconnecté
    Lorsque je clique sur le lien d'activation que j'ai reçu
    Alors je suis dirigé vers la page d'identification
    Et mon champ email est déjà pré-rempli

