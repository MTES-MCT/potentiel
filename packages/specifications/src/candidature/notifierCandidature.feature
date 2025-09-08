# language: fr
@candidature
@select
Fonctionnalité: Notifier une candidature d'un appel d'offres, suite à la notification d'une période

    Scénario: Notifier un candidat lauréat
        Etant donné la candidature lauréate "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le projet lauréat devrait être consultable
        Et le producteur du projet lauréat devrait être mis à jour
        Et la puissance du projet lauréat devrait être mise à jour
        Et l'actionnaire du projet lauréat devrait être mis à jour
        Et le fournisseur devrait être mis à jour
        Et le représentant légal du projet lauréat devrait être mis à jour

    Scénario: Notifier un candidat éliminé
        Etant donné la candidature éliminée "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature éliminée
        Alors le projet éliminé devrait être consultable

    Scénario: Impossible de notifier une candidature déjà notifiée
        Etant donné la candidature lauréate notifiée "Boulodrome de Lyon"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le DGEC validateur devrait être informé que "La candidature est déjà notifiée"

    Scénario: Impossible de notifier une période sans fonction pour le validateur
        Etant donné le DGEC Validateur sans fonction
        Et la candidature lauréate "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le DGEC validateur devrait être informé que "La fonction de l'utilisateur doit être précisée pour cette opération"

    Scénario: Impossible de notifier une période sans nom pour le validateur
        Etant donné le DGEC Validateur sans nom
        Et la candidature lauréate "Du boulodrome de Paris"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le DGEC validateur devrait être informé que "Le nom de l'utilisateur doit être précisé pour cette opération"
