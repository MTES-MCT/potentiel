# language: fr
Fonctionnalité: Import d'un fichier de candidats

  @admin
  Scénario: Fichier au bon format
    Etant donné que je me rends sur la page d'import de candidats
    Lorsque je selectionne le fichier "candidats.csv"
    Et que je valide le formulaire
    Alors je suis dirigé vers la page qui liste les projets à notifier
    Et on me notifie la réussite par "1 projet(s) ont bien été importé(s) ou mis à jour dont 1 à notifier."
    Et la liste ne contient qu'un seul projet
    Et je trouve bien le projet "Nom du projet" dans la liste des projets
    Et le projet "Nom du projet" a bien une section details qui contient un champ "Autre champ" qui a la valeur "Autre valeur"

  @admin
  Scénario: Ré-import d'un projet existant avec changement
    Etant donné le projet suivant
      | appelOffreId | periodeId | numeroCRE | familleId | nomProjet            | notifiedOn    | garantiesFinancieresSubmittedOn | garantiesFinancieresSubmittedBy | garantiesFinancieresFile | garantiesFinancieresDate | details                                                                               |
      | CRE4 - Sol   | 7         | 1         | 1         | Ancien nom du projet | 1589466999101 | 1234                            | userId                          | fichier.pdf              | 5678                     | {"Ancien champ": "Valeur ancien champ", "Autre champ": "Ancienne valeur autre champ"} |
    Etant donné que je me rends sur la page d'import de candidats
    Lorsque je selectionne le fichier "candidats.csv"
    Et que je valide le formulaire
    Alors je suis dirigé vers la page qui liste les projets
    Et on me notifie la réussite par "1 projet(s) ont bien été importé(s) ou mis à jour."
    Et la liste ne contient qu'un seul projet
    Et je trouve bien le projet "Nom du projet" dans la liste des projets
    Et le projet "Nom du projet" a bien une section details qui ne contient pas de champ "Ancien champ"
    Et le projet "Nom du projet" a bien une section details qui contient un champ "Autre champ" qui a la valeur "Autre valeur"
    Et le projet "Nom du projet" a toujours ses informations de garanties financieres

  @admin
  Scénario: Ré-import d'un projet existant sans changement
    Etant donné le projet suivant
      | appelOffreId | periodeId | numeroCRE | familleId | nomCandidat     | nomProjet     | puissance | prixReference | note | nomRepresentantLegal | email          | adresseProjet | codePostalProjet | communeProjet | departementProjet | regionProjet | motifsElimination | classe | fournisseur    | evaluationCarbone | notifiedOn | details                           |
      | CRE4 - Sol   | 7         | 1         | 1         | Nom du candidat | Nom du projet | 250       | 11            | 19   | Représentant légal   | test@test.test | 3 sur la voie | 12345            | Commune       | Aveyron           | Occitanie    |                   | Classé | Fabricant film | 3                 | 12345      | { "Autre champ": "Autre valeur" } |
    Etant donné que je me rends sur la page d'import de candidats
    Lorsque je selectionne le fichier "candidats.csv"
    Et que je valide le formulaire
    Alors je suis dirigé vers la page qui liste les projets
    Et on me notifie la réussite par "L'import est un succès mais le fichier importé n'a pas donné lieu à des changements dans la base de projets."

# Scénario: Fichier au mauvais format
#   Etant donné que je suis un administrateur DGEC
#   Et que je suis sur la page d'import de candidats
#   Lorsque je saisis la période "Période 3T Batiment"
#   Et que je selectionne le fichier csv de la forme
#     """
#     mauvaiseColonne;etEncoreMauvais
#     1;3
#     """
#   Et que je valide le formulaire
#   Alors le site reste sur la page d'import de candidats
#   Et me notifie l'échec par "Format du fichier erroné (vérifier conformité des colonnes)"