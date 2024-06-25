# language: fr
Fonctionnalité: Annuler la mainlevée des garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat "Centrale PV"

    Scénario: Un porteur annule la demande de mainlevée des garanties financières
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif        | projet-achevé     |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
        Quand le porteur annule la demande de mainlevée des garanties financières pour le projet "Centrale PV" avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors une demande de mainlevée de garanties financières ne devrait plus être consultable pour le projet "Centrale PV"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée n'existe pas
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur annule la demande de mainlevée des garanties financières pour le projet "Centrale PV" avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "Il n'y a pas de demande de mainlevée pour ce projet"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée des garanties financières est rejetée
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières rejetée pour le projet "Centrale PV" achevé
        Quand le porteur annule la demande de mainlevée des garanties financières pour le projet "Centrale PV" avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "La demande de mainlevée a déjà été rejetée"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée des garanties financières est accordée
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières accordée pour le projet "Centrale PV" achevé
        Quand le porteur annule la demande de mainlevée des garanties financières pour le projet "Centrale PV" avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "La demande de mainlevée a déjà été accordée"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée des garanties financières est en instruction
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières en instruction pour le projet "Centrale PV"
        Quand le porteur annule la demande de mainlevée des garanties financières pour le projet "Centrale PV" avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "La demande de mainlevée est en instruction"
