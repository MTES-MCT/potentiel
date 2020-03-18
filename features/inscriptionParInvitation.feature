# language: fr
Fonctionnalité: Porteur de projet, je reçois un lien d'activation dans mon mail de notification

  Scénario: Le porteur de projet n'a pas encore de compte
    Etant donné que je suis un porteur de projet sans compte
    Et les projets suivants:
      | nomProjet | email              | classe  |
      | projet 1  | porter@projet.test | Classé  |
      | projet 2  | porter@projet.test | Eliminé |
      | projet 3  | autre@porteur.test | Classé  |
    Et que les notifications ont été envoyées aux candidats
    Lorsque je clique sur le lien d'activation reçu à l'adresse "porter@projet.test"
    Et que je crée un compte avec l'adresse "porter@projet.test"
    Et que je me rends sur la page qui liste mes projets
    Alors je vois les projets associés à mon email dans ma liste