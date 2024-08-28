# language: fr
Fonctionnalité: Notifier une période d'un appel d'offres

    @select
    Scénario: Notifier les candidats d'une période d'un appel d'offres
        Étant donné des candidats d'une période d'un appel d'offres
        Quand un DGEC validateur notifie la période d'un appel d'offres
        Alors la période devrait être notifiée avec les lauréats et les éliminés
