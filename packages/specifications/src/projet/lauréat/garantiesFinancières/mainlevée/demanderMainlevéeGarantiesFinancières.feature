# language: fr
@garanties-financières
@mainlevée-garanties-financières
Fonctionnalité: Demander la mainlevée des garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Un porteur demande la mainlevée des garanties financières de son projet abandonné
        Etant donnée un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Et des garanties financières actuelles pour le projet lauréat
        Quand le porteur demande la mainlevée des garanties financières avec :
            | motif        | projet-abandonné  |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
        Alors une demande de mainlevée de garanties financières devrait être consultable

    Scénario: Un porteur demande la mainlevée des garanties financières de son projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Quand le porteur demande la mainlevée des garanties financières avec :
            | motif        | projet-achevé     |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
        Alors une demande de mainlevée de garanties financières devrait être consultable

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet n'est pas abandonné
        Etant donné des garanties financières actuelles pour le projet lauréat
        Quand le porteur demande la mainlevée des garanties financières avec :
            | motif | projet-abandonné |
        Alors le porteur devrait être informé que "Votre demande de mainlevée de garanties financières est invalide car le projet n'est pas en statut abandonné"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet n'est pas achevé
        Etant donné des garanties financières actuelles pour le projet lauréat
        Quand le porteur demande la mainlevée des garanties financières avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Votre demande de mainlevée de garanties financières est invalide car le projet n'est pas achevé (attestation de conformité non transmise au co-contractant et dans Potentiel)"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si les garanties financières sont manquantes pour un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur demande la mainlevée des garanties financières avec :
            | motif | projet-abandonné |
        Alors le porteur devrait être informé que "Il n'y a aucunes garanties financières actuelles pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si les garanties financières sont manquantes pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande la mainlevée des garanties financières avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Il n'y a aucunes garanties financières actuelles pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet s'il y a un dépôt de garanties financières pour le projet
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Etant donné des garanties financières actuelles pour le projet lauréat
        Et un dépôt de garanties financières
        Quand le porteur demande la mainlevée des garanties financières avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Vous avez de nouvelles garanties financières à traiter pour ce projet. Pour demander la levée des garanties financières déjà validées vous devez d'abord annuler le dernier dépôt en attente de validation."

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet a déjà une demande de mainlevée
        Etant donné des garanties financières actuelles pour le projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Et une demande de mainlevée de garanties financières
        Quand le porteur demande la mainlevée des garanties financières
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée en cours pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet a déjà une demande de mainlevée en cours d'instruction
        Etant donné des garanties financières actuelles pour le projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Et une demande de mainlevée de garanties financières en instruction
        Quand le porteur demande la mainlevée des garanties financières avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée en instruction pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet a déjà une demande de mainlevée accordée
        Etant donné des garanties financières actuelles pour le projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Et une demande de mainlevée de garanties financières accordée
        Quand le porteur demande la mainlevée des garanties financières
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée accordée pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières si le projet dispose de garanties financières échues
        Etant donné des garanties financières actuelles échues le "2024-07-17" pour le projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande la mainlevée des garanties financières
        Alors le porteur devrait être informé que "Les garanties financières du projet sont déjà échues"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si l'attestation de constitution de garanties financières manque pour un projet abandonné
        Etant donné le projet lauréat "Du boulodrome de Lyon"
        Et un cahier des charges permettant la modification du projet
        Et un abandon accordé pour le projet lauréat "Du boulodrome de Lyon"
        Quand le porteur demande la mainlevée des garanties financières avec :
            | motif | projet-abandonné |
        Alors le porteur devrait être informé que "L'attestation de constitution pour ces garanties financières est manquante"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si l'attestation de constitution de garanties financières manque pour un projet achevé
        Etant donné le projet lauréat "Du boulodrome de Lyon"
        Et un cahier des charges permettant la modification du projet
        Et une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande la mainlevée des garanties financières
        Alors le porteur devrait être informé que "L'attestation de constitution pour ces garanties financières est manquante"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet exempté de garanties financières
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres       | PPE2 - Petit PV Bâtiment |
            | type GF              | exemption                |
            | date de constitution | 2025-01-01               |
        Et un cahier des charges permettant la modification du projet
        Et un abandon accordé pour le projet lauréat "Du boulodrome de Lyon"
        Quand le porteur demande la mainlevée des garanties financières avec :
            | motif | projet-abandonné |
        Alors le porteur devrait être informé que "Le projet est exempt de garanties financières"
