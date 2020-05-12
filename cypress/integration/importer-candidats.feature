# language: fr
Fonctionnalité: Import d'un fichier de candidats

  @admin
  Scénario: Fichier au bon format
    Etant donné que je me rends sur la page d'import de candidats
    Lorsque je selectionne le fichier "candidats.csv"
    Et que je valide le formulaire
    Alors je suis dirigé vers la page qui liste les projets à notifier
    Et on me notifie la réussite par "Les candidats ont bien été importés."
    Et je trouve bien le projet "Nom du projet" dans la liste des projets

  @admin
  Scénario: Ré-import d'un projet existant
    Etant donné le projet suivant
      | appelOffreId | periodeId | numeroCRE | nomProjet            |
      | CRE4 - Sol   | 7         | 1         | Ancien nom du projet |
    Etant donné que je me rends sur la page d'import de candidats
    Lorsque je selectionne le fichier "candidats.csv"
    Et que je valide le formulaire
    Alors je suis dirigé vers la page qui liste les projets à notifier
    Et on me notifie la réussite par "Les candidats ont bien été importés."
    Et la liste ne contient qu'un seul projet
    Et je trouve bien le projet "Nom du projet" dans la liste des projets

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