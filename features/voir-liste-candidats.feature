# language: fr
Fonctionnalité: Admin DGEC, je peux voir une liste de tous les projets

  Scénario: Afficher liste des projets
    Etant donné que je suis un administrateur DGEC
    Et les projets suivants:
      | periode         | famille | nomProjet  | communeProjet | departementProjet | regionProjet         | nomCandidat | nomRepresentantLegal | email              | puissance | prixReference | evaluationCarbone | classe |
      | Batiment 3T2020 | 1       | project PV | Lyon          | 69                | Rhone-Alpes-Auvergne | PV3000      | Mr Porter            | porter@projet.test | 255       | 89            | 9                 | Classé |
    Lorsque je me rends sur la page qui liste tous les projets
    Alors je vois une liste de projets, avec pour chaque projet les champs suivants:
      | periode | famille | nomProjet | communeProjet | departementProjet | regionProjet | nomCandidat | nomRepresentantLegal | email | puissance | prixReference | evaluationCarbone | classe | motifsElimination |