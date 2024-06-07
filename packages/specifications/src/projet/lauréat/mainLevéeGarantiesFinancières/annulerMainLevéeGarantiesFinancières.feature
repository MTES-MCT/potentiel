#Language: fr-FR
Fonctionnalité: Annuler la main-levée des garanties financières d'un projet
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"

    Scénario: Un porteur annule la demande de main-levée des garanties financières de son projet
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de main-levée de garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |
            | utilisateur          | porteur@test.test      |
            | date demande         | 2014-05-28             |
        Quand le porteur annule la demande de main-levée des garanties financières pour le projet "Centrale PV" avec :
            | utilisateur          | porteur@test.test      |
            | date annulation      | 2014-05-28             |
        Alors une demande de main-levée de garanties financières ne devrait plus être consultable pour le projet "Centrale PV"

    Scénario: Impossible d'annuler une demande de main-levée des garanties financières de son projet si la demande de main-levée n'existe pas
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur annule la demande de main-levée des garanties financières pour le projet "Centrale PV" avec :
            | utilisateur          | porteur@test.test      |
            | date annulation      | 2014-05-28             |
        Alors le porteur devrait être informé que "Il n'y a pas de demande de main-levée pour ce projet"

    @NotImplemented
    Scénario: Impossible d'annuler une demande de main-levée des garanties financières de son projet si la levée des garanties financières de son projet est rejetée
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de main-levée de garanties financières pour le projet "Centrale PV" avec :    
        Et un rejet de la demande de main-levée pour le projet "Centrale PV" avec :
            | utilisateur          | porteur@test.test      |
            | date demande         | 2014-05-28             |
        Quand le porteur annule la demande de main-levée des garanties financières pour le projet "Centrale PV" avec :
            | utilisateur          | porteur@test.test      |
            | date annulation      | 2014-05-28             |
        Alors le porteur devrait être informé que "La demande de main-levée a déjà été rejetée"

    @NotImplemented
    Scénario: Impossible d'annuler une demande de main-levée des garanties financières de son projet si la levée des garanties financières de son projet est accordée
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de main-levée de garanties financières pour le projet "Centrale PV" avec :
        Et une validation de la demande de main-levée pour le projet "Centrale PV"    
        Quand le porteur annule la demande de main-levée des garanties financières pour le projet "Centrale PV" avec :
            | utilisateur          | porteur@test.test      |
            | date annulation      | 2014-05-28             |
        Alors le porteur devrait être informé que "La demande de main-levée a déjà été accordée"

    @NotImplemented
    Scénario: Impossible d'annuler une demande de main-levée des garanties financières de son projet si la levée des garanties financières de son projet est en instruction
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de main-levée de garanties financières pour le projet "Centrale PV" avec :
        Et un passage en instruction de la demande de main-levée du projet "Centrale PV"  
        Quand le porteur annule la demande de main-levée des garanties financières pour le projet "Centrale PV" avec :
            | utilisateur          | porteur@test.test      |
            | date annulation      | 2014-05-28             |
        Alors le porteur devrait être informé que "La demande de main-levée est en instruction"
