# language: fr
Fonctionnalité: Listing des invitations

  Contexte:
    Etant donné les invitations suivantes
      | email                    | fullName                   | appelOffreId | periodeId | projectId | dreal | createdAt     | lastUsedAt    |
      | dreal-unused@test.com    | dreal non inscrit          |              |           |           | Corse | 1588924095642 | 0             |
      | dreal-used@test.com      | dreal inscrit              |              |           |           | Corse | 1588924095642 | 1588924095642 |
      | pp-unused-F1@test.com    | porteur fessenheim 1       | Fessenheim   | 1         |           |       | 1588924095642 | 0             |
      | pp-unused-F2@test.com    | porteur fessenheim 2       | Fessenheim   | 2         |           |       | 1588924095642 | 0             |
      | pp-unused-other@test.com | porteur autre AO           | Other        | 1         |           |       | 1588924095642 | 0             |
      | pp-used@test.com         | porteur inscrit            |              |           |           |       | 1588924095642 | 1588924095642 |
      | pp-unused-no-AO@test.com | porteur invitation sans AO |              |           |           |       | 1591602495642 | 0             |

  @admin
  Scénario: Je vois les invitations porteur-projet non-utilisées
    Lorsque je me rends sur la page admin qui liste les invitations
    Alors l'invitation de "pp-unused-F1@test.com" se trouve dans la liste
    Et l'invitation de "pp-unused-F2@test.com" se trouve dans la liste
    Et l'invitation de "pp-unused-no-AO@test.com" se trouve dans la liste
    Et l'invitation de "dreal-unused-other@test.com" ne se trouve pas dans la liste
    Et l'invitation de "dreal-used@test.com" ne se trouve pas dans la liste
    Et l'invitation de "pp-used@test.com" ne se trouve pas dans la liste

  @admin
  Scénario: Je relance tous les porteurs de projets invités et non-inscrits
    Lorsque je me rends sur la page admin qui liste les invitations
    Et que je click sur le bouton "Relancer les 4 invitations de cette période"
    Alors "4" emails de notifications sont envoyés

  @admin
  Scénario: Je relance les porteurs de projets invités et non-inscrits sur un appel d'offre
    Lorsque je me rends sur la page admin qui liste les invitations
    Et que je sélectionne l'appel d'offre "Fessenheim"
    Et que je click sur le bouton "Relancer les 2 invitations de cette période"
    Alors "2" emails de notifications sont envoyés
    Et "pp-unused-F1@test.com" reçoit un mail de notification avec un lien d'invitation
    Et "pp-unused-F2@test.com" reçoit un mail de notification avec un lien d'invitation
    Lorsque je me déconnecte
    Et que je click sur le lien d'invitation reçu dans le mail de notification
    Alors je suis dirigé vers la page de création de compte
    Et mon champ email est déjà pré-rempli
    Et mon champ nom est déjà pré-rempli avec "porteur fessenheim 2"

  @admin
  Scénario: Je relance les porteurs de projets invités et non-inscrits sur un appel d'offre et une période
    Lorsque je me rends sur la page admin qui liste les invitations
    Et que je sélectionne l'appel d'offre "Fessenheim"
    Et que je sélectionne la période "1"
    Et que je click sur le bouton "Relancer les 1 invitations de cette période"
    Alors "1" emails de notifications sont envoyés
    Et "pp-unused-F1@test.com" reçoit un mail de notification avec un lien d'invitation


  @admin
  Scénario: Je relance un seul porteur de projet
    Lorsque je me rends sur la page admin qui liste les invitations
    Et que je click sur le bouton "relancer" pour l'invitation à "pp-unused-F1@test.com"
    Alors "1" emails de notifications sont envoyés
    Et "pp-unused-F1@test.com" reçoit un mail de notification avec un lien d'invitation