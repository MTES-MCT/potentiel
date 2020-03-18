# language: fr
Fonctionnalité: Admin DGEC, je peux notifier les candidats

  Scénario: Notifier les candidats
    Etant donné que je suis un administrateur DGEC
    Et les projets suivants:
      | nomProjet | email              | classe  |
      | projet 1  | porter@projet.test | Classé  |
      | projet 2  | porter@projet.test | Eliminé |
      | projet 3  | autre@porteur.test | Classé  |
    Et un porteur de projet inscrit avec l'adresse "porter@projet.test"
    Lorsque je me rends sur la page qui liste tous les projets
    Et que je clique sur le bouton pour notifier les candidats
    Alors une notification est générée pour chaque projet
    Et le porteur de projet inscrit voit ses nouveaux projets dans sa liste