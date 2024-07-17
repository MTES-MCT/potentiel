# language: fr
Fonctionnalité: Rejeter une demande de mainlevée des garanties financières

    Contexte:
        Etant donné le projet lauréat "Centrale PV"

    Scénario: Un utilisateur Dreal rejette une demande de mainlevée pour un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif        | projet-abandonné  |
            | date demande | 2024-06-12        |
            | utilisateur  | porteur@test.test |
        Quand un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet "Centrale PV" avec :
            | utilisateur             | dreal@test.test    |
            | date                    | 2024-05-30         |
            | contenu fichier réponse | contenu du fichier |
            | format fichier réponse  | application/pdf    |
        Alors une demande de mainlevée de garanties financières ne devrait plus être consultable pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières devrait être consultable dans l'historique des mainlevées rejetées pour le projet "Centrale PV" avec :
            | rejeté le               | 2024-05-30         |
            | rejeté par              | dreal@test.test    |
            | contenu fichier réponse | contenu du fichier |
            | format fichier réponse  | application/pdf    |
            | demandé le              | 2024-06-12         |
            | demandé par             | porteur@test.test  |
            | motif                   | projet-abandonné   |

    Scénario: Un utilisateur Dreal rejette une demande de mainlevée pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif        | projet-achevé     |
            | date demande | 2024-04-14        |
            | utilisateur  | porteur@test.test |
        Quand un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet "Centrale PV" avec :
            | utilisateur             | dreal@test.test    |
            | date                    | 2024-05-30         |
            | contenu fichier réponse | contenu du fichier |
            | format fichier réponse  | application/pdf    |
        Alors une demande de mainlevée de garanties financières ne devrait plus être consultable pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières devrait être consultable dans l'historique des mainlevées rejetées pour le projet "Centrale PV" avec :
            | rejeté le               | 2024-05-30         |
            | rejeté par              | dreal@test.test    |
            | contenu fichier réponse | contenu du fichier |
            | format fichier réponse  | application/pdf    |
            | demandé le              | 2024-04-14         |
            | demandé par             | porteur@test.test  |
            | motif                   | projet-achevé      |

    Scénario: Impossible de rejeter une demande de mainlevée si le projet n'a pas de demande de mainlevée
        Etant donné une attestation de conformité transmise pour le projet "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet "Centrale PV"
        Alors l'utilisateur devrait être informé que "Il n'y a pas de demande de mainlevée de garanties financières en cours pour ce projet"

    Scénario: Impossible de rejeter une demande de mainelevée si le projet a déjà une demande de mainlevée accordée
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Et une attestation de conformité transmise pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières accordée pour le projet "Centrale PV" achevé
        Quand un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet "Centrale PV"
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée accordée pour ce projet"

    Scénario: Impossible de rejeter une demande de mainelevée si le projet a déjà une demande de mainlevée rejetée et aucune en cours
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Et une attestation de conformité transmise pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières rejetée pour le projet "Centrale PV" achevé
        Quand un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet "Centrale PV"
        Alors le porteur devrait être informé que "La dernière demande de mainlevée pour ce projet a été rejetée, aucune n'est en cours"
