# language: fr
@période
Fonctionnalité: Notifier une période d'un appel d'offres

    Scénario: Notifier les candidats d'une période d'un appel d'offres
        Etant donné une période avec des candidats importés
        Quand un DGEC validateur notifie la période d'un appel d'offres
        Alors la période devrait être notifiée avec les lauréats et les éliminés
        Et les candidatures de la période notifiée devraient être notifiées
        Et les lauréats et éliminés devraient être consultables
        Et les porteurs doivent avoir accès à leur projet
        Et les attestations de désignation des candidatures de la période notifiée devraient être consultables
        Et les porteurs ont été prévenu que leurs candidatures ont été notifiées
        Et les partenaires ont été prévenus de la notification de la période
        Et l'administration a été prévenue de la notification de la période
        Et aucun autre email n'a été envoyé

    Scénario: Notifier les candidats oubliés d'une période d'un appel d'offres
        Etant donné une période avec des candidats notifiés
        Et des candidats oubliés pour la période d'appel d'offres
        Quand un DGEC validateur notifie la période d'un appel d'offres
        Alors la période devrait être notifiée avec les lauréats et les éliminés
        Et les candidatures de la période notifiée devraient être notifiées
        Et les porteurs doivent avoir accès à leur projet
        Et les attestations de désignation des candidatures de la période notifiée devraient être consultables
        Et les porteurs ont été prévenu que leurs candidatures ont été notifiées
        Et les lauréats et éliminés devraient être consultables

    Scénario: Impossible de notifier une période sans fonction pour le validateur
        Etant donné le DGEC Validateur sans fonction
        Et une période avec un candidat importé
        Quand le DGEC validateur notifie la période d'un appel d'offres
        Alors le DGEC validateur devrait être informé que "La fonction de l'utilisateur doit être précisée pour cette opération"

    Scénario: Impossible de notifier une période sans nom pour le validateur
        Etant donné le DGEC Validateur sans nom
        Et une période avec un candidat importé
        Quand le DGEC validateur notifie la période d'un appel d'offres
        Alors le DGEC validateur devrait être informé que "Le nom de l'utilisateur doit être précisé pour cette opération"
