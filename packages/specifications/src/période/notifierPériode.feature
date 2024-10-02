# language: fr
Fonctionnalité: Notifier une période d'un appel d'offres

    Contexte:
        Etant donné le DGEC validateur "Robert Robichet"
        Et des candidats d'une période d'un appel d'offres

    Scénario: Notifier les candidats d'une période d'un appel d'offres
        Quand un DGEC validateur notifie la période d'un appel d'offres
        Alors la période devrait être notifiée avec les lauréats et les éliminés
        Et les candidatures de la période notifiée devraient être notifiées
        Et le porteur a été prévenu que sa candidature a été notifiée
        Et les lauréats et éliminés devraient être consultables

    @select
    Scénario: Notifier les candidats d'une période d'un appel d'offres une seconde fois
        Quand un DGEC validateur notifie la période d'un appel d'offres
        Et un DGEC validateur notifie une seconde fois la période d'un appel d'offres
        Alors la période devrait être notifiée avec les lauréats et les éliminés
        Et les candidatures de la période notifiée devraient être notifiées
        Et le porteur a été prévenu que sa candidature a été notifiée
        Et les lauréats et éliminés devraient être consultables
