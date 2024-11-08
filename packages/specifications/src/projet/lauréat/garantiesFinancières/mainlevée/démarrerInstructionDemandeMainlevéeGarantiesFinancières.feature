# language: fr
Fonctionnalité: Démarrer l'instruction d'une demande de mainlevée des garanties financières

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et le DGEC validateur "Robert Robichet"

    Scénario: Un utilisateur Dreal démarre l'instruction d'une demande de mainlevée pour un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-abandonné |
        Quand un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières du projet "Du boulodrome de Marseille" avec :
            | utilisateur | dreal@test.test |
            | date        | 2024-05-30      |
        Alors une demande de mainlevée de garanties financières en instruction devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | instruction démarrée le  | 2024-05-30      |
            | instruction démarrée par | dreal@test.test |
            | mise à jour le           | 2024-05-30      |
            | mise à jour par          | dreal@test.test |
        Et le détail de la mainlevée pour le projet "Du boulodrome de Marseille" devrait être consultable avec le statut "en-instruction"

    Scénario: Un utilisateur Dreal démarre l'instruction d'une demande de mainlevée pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-achevé |
        Quand un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières du projet "Du boulodrome de Marseille" avec :
            | utilisateur | dreal@test.test |
            | date        | 2024-05-30      |
        Alors une demande de mainlevée de garanties financières en instruction devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | instruction démarrée le  | 2024-05-30      |
            | instruction démarrée par | dreal@test.test |
            | mise à jour le           | 2024-05-30      |
            | mise à jour par          | dreal@test.test |
        Et le détail de la mainlevée pour le projet "Du boulodrome de Marseille" devrait être consultable avec le statut "en-instruction"

    Scénario: Impossible de démarrer une instruction de demande de mainlevée si le projet n'a pas de demande de mainlevée
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Quand un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières du projet "Du boulodrome de Marseille"
        Alors le porteur devrait être informé que "Il n'y a pas de demande de mainlevée de garanties financières en cours pour ce projet"

    Scénario: Impossible de démarrer une instruction de demande de mainlevée si le projet a déjà une demande de mainlevée en cours d'instruction
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières en instruction pour le projet "Du boulodrome de Marseille"
        Quand un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières du projet "Du boulodrome de Marseille"
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée en instruction pour ce projet"

    Scénario: Impossible de démarrer une instruction de demande de mainlevée si le projet a déjà une demande de mainlevée accordée
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières accordée pour le projet "Du boulodrome de Marseille" achevé
        Quand un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières du projet "Du boulodrome de Marseille"
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée accordée pour ce projet"

    Scénario: Impossible de démarrer une instruction de demande de mainlevée si le projet a déjà une demande de mainlevée rejetée et aucune en cours
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières rejetée pour le projet "Du boulodrome de Marseille" achevé
        Quand un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières du projet "Du boulodrome de Marseille" avec :
            | utilisateur | dreal@test.test |
            | date        | 2024-05-30      |
        Alors le porteur devrait être informé que "La dernière demande de mainlevée pour ce projet a été rejetée, aucune n'est en cours"
