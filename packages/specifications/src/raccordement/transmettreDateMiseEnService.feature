#Language: fr-FR
Fonctionnalité: Transmettre une date de mise en service pour une demande complète de raccordement

@working
    Scénario: Un administrateur transmet une date de mise en service pour un dossier de raccordement
        Etant donné un dossier de raccordement
        Quand un administrateur transmet la date de mise en service "2023-03-27" pour ce dossier de raccordement
        Alors la date de mise en service "2023-03-27" devrait être consultable dans le dossier de raccordement
@working
    Scénario: Impossible de transmettre une date de mise en service pour un projet sans dossier de raccordement
        Quand un administrateur transmet une date de mise en service pour un projet n'ayant aucun dossier de raccordement
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"
@working
     Scénario: Impossible de transmettre une date de mise en service pour un dossier de raccordement non référencé
        Etant donné un dossier de raccordement
        Quand un administrateur transmet une date de mise en service pour un dossier de raccordement non référencé
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"