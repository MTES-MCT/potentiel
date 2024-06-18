#Language: fr-FR
Fonctionnalité: Modifier une réponse signée de mainlevée de garanties financières accordée
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"

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
            | utilisateur                | dreal2@test.test       |
            | date                       | 2024-06-15             |
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |   
        Alors une demande de mainlevée de garanties financières accordée devrait être consultable pour le projet "Centrale PV" avec :
            | accordé le                 | 2024-05-30             |
            | accordé par                | dreal@test.test        |
            | mise à jour le             | 2024-06-15             | 
            | mise à jour par            | dreal2@test.test       | 
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |

    Scénario: Impossible de modifier la réponse signée d'une mainlevée accordée si le projet n'a pas de mainlevée demandée
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand un utilisateur Dreal modifie la réponse signée de la mainlevée des garanties financières du projet "Centrale PV" avec :
            | utilisateur                | dreal2@test.test       |
            | date                       | 2024-06-15             |
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |          
        Alors l'utilisateur devrait être informé que "Il n'y a pas de demande de mainlevée de garanties financières en cours pour ce projet"

    Scénario: Impossible de modifier la réponse signée d'une mainlevée accordée si le projet n'a pas de mainlevée accordée
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif                      | projet-achevé          |
        Quand un utilisateur Dreal modifie la réponse signée de la mainlevée des garanties financières du projet "Centrale PV" avec :
            | utilisateur                | dreal2@test.test       |
            | date                       | 2024-06-15             |
            | format fichier réponse     | application/pdf        |
            | contenu fichier réponse    | nouveau contenu        |          
        Alors l'utilisateur devrait être informé que "Il n'y a pas de mainlevée de garanties financières accordée pour ce projet"