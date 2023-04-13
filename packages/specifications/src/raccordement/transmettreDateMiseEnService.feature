#Language: fr-FR
Fonctionnalité: Transmettre une date de mise en service pour une demande complète de raccordement

    Scénario: Un administrateur transmet une date de mise en service pour un dossier de raccordement
        Etant donné un dossier de raccordement
        Quand un administrateur transmet la date de mise en service "2023-03-27" pour ce dossier de raccordement
        Alors la date de mise en service "2023-03-27" devrait être consultable dans le dossier de raccordement

    Scénario: Impossible d'envoyer date de mise en service pour un projet sans dossier de raccordement
        Quand un administrateur transmet une date de mise en service pour un dossier de raccordement inconnu
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'existe pas"

     Scénario: Impossible d'envoyer date de mise en service pour un dossier de raccordement inconnu
        Etant donné un dossier de raccordement
        Quand un administrateur transmet une date de mise en service pour un dossier de raccordement inconnu
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'existe pas"    
