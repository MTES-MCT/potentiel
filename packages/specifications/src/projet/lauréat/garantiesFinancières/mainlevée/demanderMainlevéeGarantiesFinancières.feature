# language: fr
Fonctionnalité: Demander la mainlevée des garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et le DGEC validateur "Robert Robichet"

    Scénario: Un porteur demande la levée des garanties financières de son projet abandonné
        Etant donnée un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif        | projet-abandonné  |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
        Alors une demande de mainlevée de garanties financières devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | motif        | projet-abandonné  |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
            | statut       | demandé           |

    Scénario: Un porteur demande la levée des garanties financières de son projet achevé
        Etant donné une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif        | projet-achevé     |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
        Alors une demande de mainlevée de garanties financières devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | motif        | projet-achevé     |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
            | statut       | demandé           |

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet n'est pas abandonné
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-abandonné |
        Alors le porteur devrait être informé que "Votre demande de mainlevée de garanties financières est invalide car le projet n'est pas en statut abandonné"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet n'est pas achevé
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Votre demande de mainlevée de garanties financières est invalide car le projet n'est pas achevé (attestation de conformité non transmise au co-contractant et dans Potentiel)"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si les garanties financières sont manquantes pour un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-abandonné |
        Alors le porteur devrait être informé que "Il n'y a pas de garanties financières à lever pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si les garanties financières sont manquantes pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Il n'y a pas de garanties financières à lever pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet s'il y a un dépôt de garanties financières pour le projet
        Etant donné une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Vous avez de nouvelles garanties financières à traiter pour ce projet. Pour demander la levée des garanties financières déjà validées vous devez d'abord annuler le dernier dépôt en attente de validation."

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet a déjà une demande de mainlevée
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-achevé |
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée en cours pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet a déjà une demande de mainlevée en cours d'instruction
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières en instruction pour le projet "Du boulodrome de Marseille"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée en instruction pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet a déjà une demande de mainlevée accordée
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières accordée pour le projet "Du boulodrome de Marseille" achevé
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée accordée pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières si le projet dispose de garanties financières échues
        Etant donné des garanties financières actuelles échues pour le projet "Du boulodrome de Marseille" avec :
            | date d'échéance | 2024-07-17         |
            | type            | avec-date-échéance |
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif        | projet-achevé     |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
        Alors le porteur devrait être informé que "Votre demande de mainlevée de garanties financières est invalide car les garanties financières du projet sont échues"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si l'attestation de constitution de garanties financières manque pour un projet abandonné
        Etant donné le projet lauréat "Du boulodrome de Lyon"
        Et un abandon accordé pour le projet lauréat "Du boulodrome de Lyon"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Lyon" avec :
            | motif | projet-abandonné |
        Alors le porteur devrait être informé que "Votre demande n'a pas pu être enregistrée car l'attestation de constitution de vos garanties financières reste à transmettre dans Potentiel"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si l'attestation de constitution de garanties financières manque pour un projet achevé
        Etant donné le projet lauréat "Du boulodrome de Lyon"
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Lyon"
        Quand le porteur demande la mainlevée des garanties financières pour le projet "Du boulodrome de Lyon" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Votre demande n'a pas pu être enregistrée car l'attestation de constitution de vos garanties financières reste à transmettre dans Potentiel"
