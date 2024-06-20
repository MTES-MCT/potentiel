#Language: fr-FR
Fonctionnalité: Modifier une réponse signée de mainlevée de garanties financières accordée
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"

@select
    Scénario: Un utilisateur Dreal modifie la réponse signée d'une mainlevée rejetée
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif                      | projet-achevé          |
            | date demande               | 2024-05-29             |
        Quand un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet "Centrale PV" avec :
            | utilisateur                | dreal@test.test        |
            | date                       | 2024-05-30             |
            | contenu fichier réponse    | contenu du fichier     |
            | format fichier réponse     | application/pdf        |
        Quand un utilisateur Dreal modifie la réponse signée de la mainlevée des garanties financières du projet "Centrale PV" avec :
            | date rejet                 | 2024-05-30             |   
            | date                       | 2024-06-15             |
            | utilisateur                | dreal@test.test        |
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |   
        Et une demande de mainlevée de garanties financières rejetée devrait être consultable dans l'historique des mainlevées rejetées pour le projet "Centrale PV" avec :
            | rejetée le                 | 2024-05-30             |
            | rejetée par                | dreal@test.test        |
            | contenu fichier réponse    | nouveau contenu        |
            | format fichier réponse     | application/pdf        |
            | demandée le                | 2024-05-29             |
            | demandée par               | porteur@test.test      |
            | motif                      | projet-achevé          |
            | mise à jour le             | 2024-06-15             | 
            | mise à jour par            | dreal@test.test        | 

@select
    Scénario: Un utilisateur Dreal modifie la réponse signée d'une mainlevée accordée
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif                      | projet-achevé          |
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet "Centrale PV" avec :
            | utilisateur                | dreal@test.test        |
            | date                       | 2024-05-30             |
            | contenu fichier réponse    | contenu du fichier     |
            | format fichier réponse     | application/pdf        |
        Quand un utilisateur Dreal modifie la réponse signée de la mainlevée des garanties financières du projet "Centrale PV" avec :
            | date                       | 2024-06-15             |
            | utilisateur                | dreal@test.test        |
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |   
        Alors une demande de mainlevée de garanties financières accordée devrait être consultable pour le projet "Centrale PV" avec :
            | accordée le                | 2024-05-30             |
            | accordée par               | dreal@test.test        |
            | mise à jour le             | 2024-06-15             | 
            | mise à jour par            | dreal@test.test        | 
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |

@select
    Scénario: Impossible de modifier la réponse signée d'une mainlevée accordée si le projet n'a pas de mainlevée demandée
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand un utilisateur Dreal modifie la réponse signée de la mainlevée des garanties financières du projet "Centrale PV" avec :
            | date                       | 2024-06-15             |
            | utilisateur                | dreal@test.test        |
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |           
        Alors l'utilisateur devrait être informé que "Il n'y a pas de demande de mainlevée de garanties financières en cours pour ce projet"

@select
    Scénario: Impossible de modifier la réponse signée d'une mainlevée accordée si le projet n'a pas de mainlevée accordée
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif                      | projet-achevé          |
        Quand un utilisateur Dreal modifie la réponse signée de la mainlevée des garanties financières du projet "Centrale PV" avec :
            | date                       | 2024-06-15             |
            | utilisateur                | dreal@test.test        |
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |          
        Alors l'utilisateur devrait être informé que "Il n'y a pas de mainlevée de garanties financières accordée pour ce projet"

@select
    Scénario: Impossible de modifier la réponse signée d'une mainlevée rejetée si le projet n'a pas de mainlevée rejetée
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand un utilisateur Dreal modifie la réponse signée de la mainlevée des garanties financières du projet "Centrale PV" avec :
            | date                       | 2024-06-15             |
            | date rejet                 | 2024-05-30             |   
            | utilisateur                | dreal@test.test        |
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |           
        Alors l'utilisateur devrait être informé que "Il n'y a pas de mainlevée de garanties financières rejetée pour ce projet"

@select
    Scénario: Impossible de modifier la réponse signée d'une mainlevée rejetée si le projet n'a pas de mainlevée rejetée correspondante
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif                      | projet-achevé          |
            | date demande               | 2024-05-29             |
        Quand un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet "Centrale PV" avec :
            | utilisateur                | dreal@test.test        |
            | date                       | 2024-05-30             |
            | contenu fichier réponse    | contenu du fichier     |
            | format fichier réponse     | application/pdf        |
        Quand un utilisateur Dreal modifie la réponse signée de la mainlevée des garanties financières du projet "Centrale PV" avec :
            | date rejet                 | 2024-06-01             |   
            | date                       | 2024-06-15             |
            | utilisateur                | dreal@test.test        |
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |        
        Alors l'utilisateur devrait être informé que "Il n'y a pas de mainlevée de garanties financières rejetée avec cette date de rejet pour ce projet"
