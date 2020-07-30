# language: fr
Fonctionnalité: Relance GF


  Scénario: Je relance les projets pour lesquels les garanties financières sont dues dans moins de 15 jours
    Etant donné les projets suivants
      | nomProjet             | notifiedOn | garantiesFinancieresDueOn | garantiesFinancieresRelanceOn | garantiesFinancieresSubmittedOn | email              | appelOffreId | periodeId | familleId | classe |
      | projet à relancer     | 1          | 1                         | 0                             | 0                               | porteur1@test.test | Fessenheim   | 2         | 1         | Classé |
      | projet déjà relancé   | 1          | 1                         | 1                             | 0                               | porteur2@test.test | Fessenheim   | 2         | 1         | Classé |
      | projet déjà soumis GF | 1          | 1                         | 0                             | 1                               | porteur3@test.test | Fessenheim   | 2         | 1         | Classé |
    Lorsque j'appelle le service de relance des garanties financieres
    Alors "1" emails de relance sont envoyés
    Et "porteur1@test.test" reçoit un mail de relance