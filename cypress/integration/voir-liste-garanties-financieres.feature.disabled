# language: fr
Fonctionnalité: Listing de projets

  @dreal
  Scénario: Je vois les GF des projets rattachés à ma région
    Etant donné que je suis dreal de la region "Corse"
    Et que je suis dreal de la region "Occitanie"
    Et les projets suivants
      | nomProjet             | regionProjet     | garantiesFinancieresSubmittedOn | garantiesFinancieresDate | garantiesFinancieresFile |
      | projet multi-region   | Corse / Bretagne | 1234                            | 1591361491636            | fichier.pdf              |
      | projet region         | Corse            | 1234                            | 1591361491636            | fichier.pdf              |
      | projet region 2       | Occitanie        | 1234                            | 1591361491636            | fichier.pdf              |
      | projet hors region    | Guadeloupe       | 1234                            | 1591361491636            | fichier.pdf              |
      | projet region sans gf | Corse            | 0                               | 0                        |                          |
    Lorsque je me rends sur la page admin qui liste les garanties financières
    Alors le projet "projet region" se trouve dans la liste
    Et le projet "projet multi-region" se trouve dans la liste
    Et le projet "projet region 2" se trouve dans la liste
    Et le projet "projet hors region" ne se trouve pas dans la liste
    Et le projet "projet region sans gf" ne se trouve pas dans la liste
    Et chaque ligne contient la date des dépôt des garanties financières telle que saisie par l'utilisateur
    Et chaque ligne contient un lien pour télécharger le fichier en pièce-jointe
    Lorsque je click sur la ligne "projet region"
    Alors je suis redirigé vers la page du projet "projet region"


  @admin
  Scénario: Je vois toutes les GF
    Etant donné que les projets suivants
      | nomProjet             | regionProjet     | garantiesFinancieresSubmittedOn | garantiesFinancieresDate | garantiesFinancieresFile |
      | projet multi-region   | Corse / Bretagne | 1234                            | 1591361491636            | fichier.pdf              |
      | projet region         | Corse            | 1234                            | 1591361491636            | fichier.pdf              |
      | projet region 2       | Occitanie        | 1234                            | 1591361491636            | fichier.pdf              |
      | projet hors region    | Guadeloupe       | 1234                            | 1591361491636            | fichier.pdf              |
      | projet region sans gf | Corse            | 0                               | 0                        |                          |
    Lorsque je me rends sur la page admin qui liste les garanties financières
    Alors le projet "projet region" se trouve dans la liste
    Et le projet "projet multi-region" se trouve dans la liste
    Et le projet "projet region 2" se trouve dans la liste
    Et le projet "projet hors region" se trouve dans la liste
    Et le projet "projet region sans gf" ne se trouve pas dans la liste
    Et chaque ligne contient la date des dépôt des garanties financières telle que saisie par l'utilisateur
    Et chaque ligne contient un lien pour télécharger le fichier en pièce-jointe
    Lorsque je click sur la ligne "projet region"
    Alors je suis redirigé vers la page du projet "projet region"