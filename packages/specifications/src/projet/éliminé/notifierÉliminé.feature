# language: fr
Fonctionnalité: Notifier un projet éliminé

    Contexte:
        Etant donné le DGEC validateur "Robert Robichet"
        Et la candidature éliminée "Du boulodrome de Marseille"

    Scénario: Notifier une candidature éliminée
        Quand le DGEC validateur notifie la candidature comme éliminée
        Alors le projet éliminé devrait être consultable
        Et le porteur a été prévenu que sa candidature a été notifiée
