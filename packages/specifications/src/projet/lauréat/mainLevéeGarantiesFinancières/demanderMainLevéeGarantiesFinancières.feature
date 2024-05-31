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

    Scénario: Erreur si le projet n'est pas achevé
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |
        Alors le porteur devrait être informé que "Votre demande de main-levée de garanties financières est invalide car le projet n'est pas achevé (attestation de conformité transmise au co-contractant et dans Potentiel)"

    Scénario: Erreur si les garanties financières sont manquantes pour un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-abandonné       |
        Alors le porteur devrait être informé que "Il n'y a pas de garanties financières à lever pour ce projet"

    Scénario: Erreur si les garanties financières sont manquantes pour un projet achevé
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |
        Alors le porteur devrait être informé que "Il n'y a pas de garanties financières à lever pour ce projet"

    # Erreurs si : main levée demandée, accordée ou en instruction, fichier GF manquant, dépôt de garanties financières à traiter     
    # Porteur, je ne peux pas modifier les GF de mon projet si j'ai une demande de main levée
                   
