#Language: fr-FR
Fonctionnalité: Annuler la main-levée des garanties financières d'un projet
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"
    
    @select
    Scénario: Un porteur demande l'annulation de la levée demandée des garanties financières de son projet
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de main-levée de garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |
            | utilisateur          | porteur@test.test      |
            | date demande         | 2014-05-28             |   
        Quand le porteur demande l'annulation de la main-levée pour le projet "Centrale PV"
        Alors une demande de main-levée de garanties financières ne devrait plus être consultable pour le projet "Centrale PV"

    @select
    Scénario: Erreur si la demande de main levée n'existe pas
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur demande l'annulation de la main-levée pour le projet "Centrale PV"
        Alors le porteur devrait être informé que "Il n'y a pas de main levée demandée pour ce projet"

    @NotImplemented
    Scénario: Erreur si la levée des garanties financières de son projet est rejetée
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de main-levée de garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |
            | utilisateur          | porteur@test.test      |
            | date demande         | 2014-05-28             |       
        Et un rejet de la demande de main-levée pour le projet "Centrale PV"
        Quand le porteur demande l'annulation de la main-levée pour le projet "Centrale PV"
        Alors le porteur devrait être informé que "La demande de main-levée a déjà été rejetée"

    @NotImplemented
    Scénario: Erreur si la levée des garanties financières de son projet est accordée
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de main-levée de garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |
            | utilisateur          | porteur@test.test      |
            | date demande         | 2014-05-28             |   
        Et une validation de la demande de main-levée pour le projet "Centrale PV"    
        Quand le porteur demande l'annulation de la main-levée pour le projet "Centrale PV"
        Alors le porteur devrait être informé que "La demande de main-levée a déjà été accordée"

    @NotImplemented
    Scénario: Erreur si la levée des garanties financières de son projet est en instruction
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de main-levée de garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |
            | utilisateur          | porteur@test.test      |
            | date demande         | 2014-05-28             |   
        Et un passage en instruction de la demande de main-levée du projet "Centrale PV"  
        Quand le porteur demande l'annulation de la main-levée pour le projet "Centrale PV"
        Alors le porteur devrait être informé que "La demande de main-levée est en instruction"
