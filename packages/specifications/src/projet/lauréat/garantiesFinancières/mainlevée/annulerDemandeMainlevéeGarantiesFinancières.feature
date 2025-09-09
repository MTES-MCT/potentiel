# language: fr
@garanties-financières
@mainlevée-garanties-financières
Fonctionnalité: Annuler la mainlevée des garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Un porteur annule la demande de mainlevée des garanties financières
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Et une demande de mainlevée de garanties financières avec :
            | motif        | projet-achevé     |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
        Quand le porteur annule la demande de mainlevée des garanties financières avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors une demande de mainlevée de garanties financières ne devrait plus être consultable

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée n'existe pas
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Quand le porteur annule la demande de mainlevée des garanties financières avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "Il n'y a pas de demande de mainlevée de garanties financières en cours pour ce projet"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée des garanties financières est rejetée
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Et une demande de mainlevée de garanties financières rejetée
        Quand le porteur annule la demande de mainlevée des garanties financières avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée rejetée pour ce projet"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée des garanties financières est accordée
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Et une demande de mainlevée de garanties financières accordée
        Quand le porteur annule la demande de mainlevée des garanties financières avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée accordée pour ce projet"

    Scénario: Impossible d'annuler une demande de mainlevée des garanties financières si la demande de mainlevée des garanties financières est en instruction
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Et une demande de mainlevée de garanties financières en instruction
        Quand le porteur annule la demande de mainlevée des garanties financières avec :
            | utilisateur     | porteur@test.test |
            | date annulation | 2014-05-28        |
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée en instruction pour ce projet"
