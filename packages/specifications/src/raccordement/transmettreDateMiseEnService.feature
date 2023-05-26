#Language: fr-FR
Fonctionnalité: Transmettre une date de mise en service pour une demande complète de raccordement

    Scénario: Un administrateur transmet une date de mise en service pour un dossier de raccordement
        Etant donné un dossier de raccordement
        Quand un administrateur transmet la date de mise en service "2023-03-27" pour ce dossier de raccordement
        Alors la date de mise en service "2023-03-27" devrait être consultable dans le dossier de raccordement

    Scénario: Impossible de transmettre une date de mise en service pour un projet sans dossier de raccordement
        Quand un administrateur transmet une date de mise en service pour un projet n'ayant aucun dossier de raccordement
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"

     Scénario: Impossible de transmettre une date de mise en service pour un dossier de raccordement non référencé
        Etant donné un dossier de raccordement
        Quand un administrateur transmet une date de mise en service pour un dossier de raccordement non référencé
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"    

    # Transmettre avec seulement une référence
    Scénario: Un administrateur transmet une date de mise en service avec seulement une référence
        Etant donné un dossier de raccordement
        Quand un administrateur transmet la date de mise en service "2023-03-27" avec seulement la référence du dossier de raccordement
        Alors la date de mise en service "2023-03-27" devrait être consultable dans le dossier de raccordement

    Scénario: Impossible de transmettre une date de mise en service avec seulement une référence ne correspondant à aucun dossier
        Quand un administrateur transmet une date de mise en service avec seulement une référence ne correspondant à aucun dossier
        Alors un administrateur devrait être informé que "Aucun dossier ne correspond à la référence"

    Scénario: Impossible de transmettre une date de mise en service avec seulement une référence qui correspond à plusieurs dossiers
        Etant donné plusieurs dossiers de raccordement avec la même référence
        Quand un administrateur transmet une date de mise en service avec seulement cette référence
        Alors un administrateur devrait être informé que "Plusieurs dossiers correspondent à la référence"

