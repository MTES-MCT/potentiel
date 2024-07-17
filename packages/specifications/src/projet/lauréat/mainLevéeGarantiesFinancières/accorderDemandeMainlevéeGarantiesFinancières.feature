# language: fr
Fonctionnalité: Accorder une demande de mainlevée des garanties financières

    Contexte:
        Etant donné le projet lauréat "Centrale PV"

    Scénario: Un utilisateur Dreal accorde une demande de mainlevée pour un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-abandonné |
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet "Centrale PV" avec :
            | utilisateur             | dreal@test.test    |
            | date                    | 2024-05-30         |
            | contenu fichier réponse | contenu du fichier |
            | format fichier réponse  | application/pdf    |
        Alors une demande de mainlevée de garanties financières accordée devrait être consultable pour le projet "Centrale PV" avec :
            | accordé le              | 2024-05-30         |
            | accordé par             | dreal@test.test    |
            | mise à jour le          | 2024-05-30         |
            | mise à jour par         | dreal@test.test    |
            | format fichier réponse  | application/pdf    |
            | contenu fichier réponse | contenu du fichier |

    Scénario: Un utilisateur Dreal accorde une demande de mainlevée pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-achevé |
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet "Centrale PV" avec :
            | utilisateur             | dreal@test.test    |
            | date                    | 2024-05-30         |
            | contenu fichier réponse | contenu du fichier |
            | format fichier réponse  | application/pdf    |
        Alors une demande de mainlevée de garanties financières accordée devrait être consultable pour le projet "Centrale PV" avec :
            | accordé le              | 2024-05-30         |
            | accordé par             | dreal@test.test    |
            | mise à jour le          | 2024-05-30         |
            | mise à jour par         | dreal@test.test    |
            | format fichier réponse  | application/pdf    |
            | contenu fichier réponse | contenu du fichier |

    Scénario: Impossible d'accorder une demande de mainlevée si le projet n'a pas de demande de mainlevée
        Etant donné une attestation de conformité transmise pour le projet "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet "Centrale PV"
        Alors l'utilisateur devrait être informé que "Il n'y a pas de demande de mainlevée de garanties financières en cours pour ce projet"

    Scénario: Impossible d'accorder une demande de mainlevée si le projet a déjà une demande de mainlevée accordée
        Etant donné des garanties financières validées pour le projet "Centrale PV"
            |  |  |
        Et une attestation de conformité transmise pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières accordée pour le projet "Centrale PV" achevé
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet "Centrale PV"
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée accordée pour ce projet"

    Scénario: Impossible d'accorder une demande de mainlevée si le projet a déjà une demande de mainlevée rejetée et aucune en cours
        Etant donné des garanties financières validées pour le projet "Centrale PV"
            |  |  |
        Et une attestation de conformité transmise pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières rejetée pour le projet "Centrale PV" achevé
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet "Centrale PV"
        Alors le porteur devrait être informé que "La dernière demande de mainlevée pour ce projet a été rejetée, aucune n'est en cours"
