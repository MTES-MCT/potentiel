# language: fr
Fonctionnalité: Listing des invitations

  @admin
  Scénario: Je vois les invitations porteur-projet non-utilisées
    Etant donné les invitations suivantes
      | email                      | fullName       | projectId | dreal | createdAt     | lastUsedAt    |
      | dreal-unused@test.test.com |                |           | Corse | 1591602495642 | 0             |
      | dreal-used@test.test.com   |                |           | Corse | 1591602495642 | 1591602495642 |
      | pp-unused@test.test.com    | porteur invité |           |       | 1591602495642 | 0             |
      | pp-used@test.test.com      |                |           |       | 1591602495642 | 1591602495642 |
    Lorsque je me rends sur la page admin qui liste les invitations
    Alors l'invitation de "pp-unused@test.test.com" se trouve dans la liste
    Et l'invitation de "dreal-unused@test.test.com" ne se trouve pas dans la liste
    Et l'invitation de "dreal-used@test.test.com" ne se trouve pas dans la liste
    Et l'invitation de "pp-used@test.test.com" ne se trouve pas dans la liste
    Et l'invitation de "invité-used@test.test.com" ne se trouve pas dans la liste
    Et l'invitation de "invité-unused@test.test.com" ne se trouve pas dans la liste
