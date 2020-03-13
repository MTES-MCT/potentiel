# language: fr
Fonctionnalité: Admin DGEC, je peux voir une liste de tous les projets

  Scénario: Afficher liste des projets
    Etant donné que je suis un administrateur DGEC
    Lorsque je me rends sur la page qui liste les projets
    Alors je vois une liste de projets, avec pour chaque projet les champs suivants:
      | periode | famille | nomProjet | communeProjet | departementProjet | regionProjet | nomCandidat | nomRepresentantLegal | email | puissance | prixReference | evaluationCarbone | classe | motifsElimination |