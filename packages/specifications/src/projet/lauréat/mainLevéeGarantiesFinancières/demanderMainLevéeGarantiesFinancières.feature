#Language: fr-FR
Fonctionnalité: Demander la main-levée des garanties financières d'un projet
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"
    
    Scénario: Un porteur demande la levée des garanties financières de son projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-abandonné       |
            | utilisateur          | porteur@test.test      |
            | date demande         | 2014-05-28             |
        Alors une demande de main-levée de garanties financières devrait être consultable pour le projet "Centrale PV" avec :
            | motif                | projet-abandonné       |
            | utilisateur          | porteur@test.test      |
            | date demande         | 2014-05-28             |
            | statut               | demandé                | 

    Scénario: Un porteur demande la levée des garanties financières de son projet achevé
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |
            | utilisateur          | porteur@test.test      |
            | date demande         | 2014-05-28             |
        Alors une demande de main-levée de garanties financières devrait être consultable pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |
            | utilisateur          | porteur@test.test      |
            | date demande         | 2014-05-28             |
            | statut               | demandé                | 

    Scénario: Erreur si le projet n'est pas abandonné
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-abandonné       |
        Alors le porteur devrait être informé que "Votre demande de main-levée de garanties financières est invalide car le projet n'est pas en statut abandonné"
@select
    Scénario: Erreur si le projet n'est pas achevé
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |
        Alors le porteur devrait être informé que "Votre demande de main-levée de garanties financières est invalide car le projet n'est pas achevé (attestation de conformité transmise au co-contractant et dans Potentiel)"

@NotImplemented
    Scénario: Erreur si les garanties financières sont manquantes pour un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-abandonné       |
        Alors le porteur devrait être informé que "Aucunes garanties financières n'ont été trouvée pour le projet"
@NotImplemented
    Scénario: Erreur si les garanties financières sont manquantes pour un projet achevé
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-abandonné       |
        Alors le porteur devrait être informé que "Aucunes garanties financières n'ont été trouvée pour le projet"
                   
