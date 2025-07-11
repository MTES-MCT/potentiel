# language: fr
@garanties-financières
Fonctionnalité: Annuler la mainlevée des garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges modificatif choisi

    Scénario: Un porteur annule la demande de mainlevée des garanties financières
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif        | projet-achevé     |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
        Quand le porteur annule la demande de mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors une demande de mainlevée de garanties financières ne devrait plus être consultable pour le projet "Du boulodrome de Marseille"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée n'existe pas
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Quand le porteur annule la demande de mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "Il n'y a pas de demande de mainlevée pour ce projet"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée des garanties financières est rejetée
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières rejetée pour le projet "Du boulodrome de Marseille" achevé
        Quand le porteur annule la demande de mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "La demande de mainlevée a déjà été rejetée"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée des garanties financières est accordée
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières accordée pour le projet "Du boulodrome de Marseille" achevé
        Quand le porteur annule la demande de mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "La demande de mainlevée a déjà été accordée"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée des garanties financières est en instruction
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières en instruction pour le projet "Du boulodrome de Marseille"
        Quand le porteur annule la demande de mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "La demande de mainlevée est en instruction"
