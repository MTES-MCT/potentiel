# language: fr
Fonctionnalité: Notifier une candidature d'un appel d'offres, suite à la notification d'une période

    Scénario: Notifier un candidat lauréat
        Etant donné une candidature lauréate "Du boulodrome de Marseille" importée avec :
            | statut               | classé                 |
            | appel d'offre        | <appel d'offre>        |
            | type GF              | <type GF>              |
            | date de délibération | <date de délibération> |
            | date d'échéance      | <date d'échéance>      |
        Quand un DGEC validateur notifie la candidature
        Alors la période devrait être notifiée avec les lauréats et les éliminés
        Et les candidatures de la période notifiée devraient être notifiées
        # à tester ici
        Et les porteurs doivent avoir accès à leur projet
        # à tester ici
        Et les attestations de désignation des candidatures de la période notifiée devraient être consultables
        # à tester ici
        Et le porteur a été prévenu que sa candidature a été notifiée
        # à tester ici
        Et les lauréats et éliminés devraient être consultables
        Et le projet lauréat devrait être consultable
        Et le producteur du projet lauréat devrait être mis à jour
        Et la puissance du projet lauréat devrait être mise à jour
        Et l'actionnaire du projet lauréat devrait être mise à jour
        Alors le fournisseur devrait être mis à jour
        Alors le représentant légal du projet lauréat devrait être mis à jour

    Scénario: Notifier un candidat éliminé
        Etant donné une candidature éliminé "Du boulodrome de Marseille" avec :
            | statut               | classé                 |
            | appel d'offre        | <appel d'offre>        |
            | type GF              | <type GF>              |
            | date de délibération | <date de délibération> |
            | date d'échéance      | <date d'échéance>      |
        Quand un DGEC validateur notifie la période d'un appel d'offres
        Alors la période devrait être notifiée avec les lauréats et les éliminés
        Et les candidatures de la période notifiée devraient être notifiées
        Et les porteurs doivent avoir accès à leur projet
        Et les attestations de désignation des candidatures de la période notifiée devraient être consultables
        Et le porteur a été prévenu que sa candidature a été notifiée
        Et les lauréats et éliminés devraient être consultables
        Et le projet lauréat devrait être consultable
        Et le producteur du projet lauréat devrait être mis à jour
        Et la puissance du projet lauréat devrait être mise à jour
        Et l'actionnaire du projet lauréat devrait être mise à jour
        Alors le fournisseur devrait être mis à jour
        Alors le représentant légal du projet lauréat devrait être mis à jour

    Scénario: Impossible de notifier une candidature déjà notifiée
        Etant donné la candidature lauréate notifiée "Boulodrome Sainte Livrade"
        Quand le DGEC validateur notifie la candidature
        Alors le DGEC validateur devrait être informé que "La candidature est déjà notifiée"

    Scénario: Impossible de notifier une période sans fonction pour le validateur
        Etant donné le DGEC Validateur sans fonction
        Et la candidature lauréate "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature
        Alors le DGEC validateur devrait être informé que "La fonction de l'utilisateur doit être précisée pour cette opération"

    Scénario: Impossible de notifier une période sans nom pour le validateur
        Etant donné le DGEC Validateur sans nom
        Et la candidature lauréate "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature
        Alors le DGEC validateur devrait être informé que "Le nom de l'utilisateur doit être précisé pour cette opération"
