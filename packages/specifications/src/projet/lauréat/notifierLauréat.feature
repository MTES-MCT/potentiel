# language: fr
Fonctionnalité: Notifier un projet lauréat

    Contexte:
        Etant donné le DGEC validateur "Robert Robichet"
        Et la candidature lauréate "Du boulodrome de Marseille"

    Scénario: Notifier une candidature classée
        Quand le DGEC validateur notifie la candidature comme lauréate
        Alors le projet lauréat devrait être consultable
        Et le porteur a été prévenu que sa candidature a été notifiée
