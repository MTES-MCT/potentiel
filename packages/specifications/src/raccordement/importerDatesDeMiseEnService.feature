#Language: fr-FR
Fonctionnalité: Importer plusieurs dates de mise en service

    Scénario: Un administrateur importe plusieurs dates de mise en service pour un dossier de raccordement
        Etant donné plusieurs dossiers de raccordement
        Quand un administrateur importe des dates de mise en service pour chacun de ces dossiers
        Alors les dossiers devraient avoir la date de mise en service à jour

    Scénario: Un administrateur importe plusieurs dates de mise en service pour un dossier de raccordement
        Etant donné les dossiers de raccordement suivant :
        | Projet | Référence |
        |        |           |
        Quand un administrateur importe des dates de mise en service pour chacun de ces dossiers
        Alors les dossiers devraient avoir la date de mise en service à jour
