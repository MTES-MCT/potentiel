# language: fr
@candidature
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
        Et les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et l'attestation de désignation de la candidature devrait être consultable

    Scénario: Notifier un candidat lauréat avec des champs spécifiques
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment         |
            | installateur                             | Installeur.INC                   |
            | installation avec dispositif de stockage | oui                              |
            | nature de l'exploitation                 | vente-avec-injection-en-totalité |
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le projet lauréat devrait être consultable
        Et le producteur du projet lauréat devrait être mis à jour
        Et la puissance du projet lauréat devrait être mise à jour
        Et l'actionnaire du projet lauréat devrait être mis à jour
        Et le fournisseur devrait être mis à jour
        Et le représentant légal du projet lauréat devrait être mis à jour
        Et l'installateur du projet lauréat devrait être mis à jour
        Et l'information concernant le couplage de l'installation avec un dispositif de stockage pour le projet lauréat devrait être mise à jour
        Et la nature de l'exploitation du projet lauréat devrait être mise à jour
        Et l'attestation de désignation de la candidature devrait être consultable

    Scénario: Notifier un candidat éliminé
        Etant donné la candidature éliminée "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature éliminée
        Alors le projet éliminé devrait être consultable
        Et l'attestation de désignation de la candidature devrait être consultable

    Scénario: Impossible de notifier une candidature déjà notifiée
        Etant donné la candidature lauréate notifiée "Boulodrome de Lyon"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le DGEC validateur devrait être informé que "La candidature est déjà notifiée"

    Scénario: Impossible de notifier une candidature sans fonction pour le validateur
        Etant donné le DGEC Validateur sans fonction
        Et la candidature lauréate "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le DGEC validateur devrait être informé que "La fonction de l'utilisateur doit être précisée pour cette opération"

    Scénario: Impossible de notifier une candidature sans nom pour le validateur
        Etant donné le DGEC Validateur sans nom
        Et la candidature lauréate "Du boulodrome de Paris"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le DGEC validateur devrait être informé que "Le nom de l'utilisateur doit être précisé pour cette opération"
