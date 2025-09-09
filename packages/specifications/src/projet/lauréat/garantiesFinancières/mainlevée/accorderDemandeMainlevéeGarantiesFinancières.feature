# language: fr
@garanties-financières
@mainlevée-garanties-financières
Fonctionnalité: Accorder une demande de mainlevée des garanties financières

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Un utilisateur Dreal accorde une demande de mainlevée pour un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Et des garanties financières actuelles pour le projet lauréat
        Et une demande de mainlevée de garanties financières avec :
            | motif | projet-abandonné |
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières
        Alors une demande de mainlevée de garanties financières devrait être consultable

    Scénario: Un utilisateur Dreal accorde une demande de mainlevée pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Et une demande de mainlevée de garanties financières avec :
            | motif | projet-achevé |
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières
        Alors une demande de mainlevée de garanties financières devrait être consultable

    Scénario: Impossible d'accorder une demande de mainlevée si le projet n'a pas de demande de mainlevée
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières
        Alors l'utilisateur devrait être informé que "Il n'y a pas de demande de mainlevée de garanties financières en cours pour ce projet"

    Scénario: Impossible d'accorder une demande de mainlevée si le projet a déjà une demande de mainlevée accordée
        Etant donné des garanties financières actuelles pour le projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Et une demande de mainlevée de garanties financières accordée
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée accordée pour ce projet"

    Scénario: Impossible d'accorder une demande de mainlevée si le projet a déjà une demande de mainlevée rejetée et aucune en cours
        Etant donné des garanties financières actuelles pour le projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Et une demande de mainlevée de garanties financières rejetée
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières
        Alors le porteur devrait être informé que "La dernière demande de mainlevée pour ce projet a été rejetée, aucune n'est en cours"
