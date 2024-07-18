# language: fr
Fonctionnalité: Demander la mainlevée des garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat "Centrale PV"

    Scénario: Un porteur demande la levée des garanties financières de son projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif        | projet-abandonné  |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
        Alors une demande de mainlevée de garanties financières devrait être consultable pour le projet "Centrale PV" avec :
            | motif        | projet-abandonné  |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
            | statut       | demandé           |
        Alors une demande de mainlevée pour le projet "Centrale PV" devrait être consultable dans la liste des demandes de mainlevée

    Scénario: Un porteur demande la levée des garanties financières de son projet achevé
        Etant donné une attestation de conformité transmise pour le projet "Centrale PV"
        Et des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif        | projet-achevé     |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
        Alors une demande de mainlevée de garanties financières devrait être consultable pour le projet "Centrale PV" avec :
            | motif        | projet-achevé     |
            | utilisateur  | porteur@test.test |
            | date demande | 2014-05-28        |
            | statut       | demandé           |
        Alors une demande de mainlevée pour le projet "Centrale PV" devrait être consultable dans la liste des demandes de mainlevée

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet n'est pas abandonné
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-abandonné |
        Alors le porteur devrait être informé que "Votre demande de mainlevée de garanties financières est invalide car le projet n'est pas en statut abandonné"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet n'est pas achevé
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Votre demande de mainlevée de garanties financières est invalide car le projet n'est pas achevé (attestation de conformité non transmise au co-contractant et dans Potentiel)"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si les garanties financières sont manquantes pour un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-abandonné |
        Alors le porteur devrait être informé que "Il n'y a pas de garanties financières à lever pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si les garanties financières sont manquantes pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Il n'y a pas de garanties financières à lever pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si l'attestation de constitution de garanties financières manque pour un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Centrale PV"
        Et le type de garanties financières importé pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-abandonné |
        Alors le porteur devrait être informé que "Votre demande n'a pas pu être enregistrée car l'attestation de constitution de vos garanties financières reste à transmettre dans Potentiel"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si l'attestation de constitution de garanties financières manque pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet "Centrale PV"
        Et le type de garanties financières importé pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Votre demande n'a pas pu être enregistrée car l'attestation de constitution de vos garanties financières reste à transmettre dans Potentiel"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet s'il y a des garanties financières à traiter pour le projet
        Etant donné une attestation de conformité transmise pour le projet "Centrale PV"
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Et des garanties financières à traiter pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Vous avez de nouvelles garanties financières à traiter pour ce projet. Pour demander la levée des garanties financières déjà validées vous devez d'abord annuler le dernier dépôt en attente de validation."

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet a déjà une demande de mainlevée
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Et une attestation de conformité transmise pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-achevé |
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée en cours pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet a déjà une demande de mainlevée en cours d'instruction
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Et une attestation de conformité transmise pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières en instruction pour le projet "Centrale PV"
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée en instruction pour ce projet"

    Scénario: Impossible de demander la mainlevée des garanties financières d'un projet si le projet a déjà une demande de mainlevée accordée
        Etant donné des garanties financières validées pour le projet "Centrale PV"
        Et une attestation de conformité transmise pour le projet "Centrale PV"
        Et une demande de mainlevée de garanties financières accordée pour le projet "Centrale PV" achevé
        Quand le porteur demande la levée des garanties financières pour le projet "Centrale PV" avec :
            | motif | projet-achevé |
        Alors le porteur devrait être informé que "Il y a déjà une demande de mainlevée accordée pour ce projet"

    # À vérifier côté métier
    @NotImplemented
    Scénario: Impossible de demander la mainlevée des garanties financières si le projet dispose de garanties financières échues

