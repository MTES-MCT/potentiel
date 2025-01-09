# language: fr
Fonctionnalité: Notifier une période d'un appel d'offres

    Scénario: Notifier les candidats d'une période d'un appel d'offres
        Etant donné une période avec des candidats importés
        Quand un DGEC validateur notifie la période d'un appel d'offres
        Alors la période devrait être notifiée avec les lauréats et les éliminés
        Et les candidatures de la période notifiée devraient être notifiées
        Et les attestations de désignation des candidatures de la période notifiée devraient être consultables
        Et le porteur a été prévenu que sa candidature a été notifiée
        Et les lauréats et éliminés devraient être consultables

    Scénario: Notifier les candidats oubliés d'une période d'un appel d'offres
        Etant donné une période avec des candidats notifiés
        Et des candidats oubliés pour la période d'appel d'offres
        Quand un DGEC validateur notifie la période d'un appel d'offres
        Alors la période devrait être notifiée avec les lauréats et les éliminés
        Et les candidatures de la période notifiée devraient être notifiées
        Et les attestations de désignation des candidatures de la période notifiée devraient être consultables
        Et les lauréats et éliminés devraient être consultables

    Scénario: Impossible de notifier une période sans fonction pour le validateur
        Etant donné le DGEC Validateur sans fonction "Faustine Morel"
        Et une période avec des candidats importés
        Quand le DGEC validateur notifie la période d'un appel d'offres
        Alors le DGEC validateur devrait être informé que "La fonction de l'utilisateur doit être précisée pour cette opération"

    Scénario: Impossible de notifier une période sans nom pour le validateur
        Etant donné le DGEC Validateur sans nom
        Et une période avec des candidats importés
        Quand le DGEC validateur notifie la période d'un appel d'offres
        Alors le DGEC validateur devrait être informé que "Le nom de l'utilisateur doit être précisé pour cette opération"
