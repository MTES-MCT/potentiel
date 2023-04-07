#language: fr-FR
Fonctionnalité: Transmettre une date de mise en service pour une demande complète de raccordement

    Scénario: Un administrateur transmet une date de mise en service pour une demande complète de raccordement
        Etant donné une demande complète de raccordement
        Quand un administrateur transmet une date de mise en service pour une demande complète de raccordement
        Alors la date de mise en service devrait être consultable dans la demande complète de raccordement

    Scénario: Impossible d'envoyer date de mise en service pour une demande de raccordement inconnue
        Quand un administrateur transmet une date de mise en service pour une demande complète de raccordement inconnue
        Alors un administrateur devrait être informé que "La demande complète de raccordement n'existe pas"
