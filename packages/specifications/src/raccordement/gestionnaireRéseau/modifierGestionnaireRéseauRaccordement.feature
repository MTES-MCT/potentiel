# language: fr
@raccordement
@gestionnaire-réseau-raccordement
Fonctionnalité: Modifier le gestionnaire de réseau d'un raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Et le gestionnaire de réseau "Arc Energies Maurienne"
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement
        Quand le porteur modifie le gestionnaire de réseau du projet avec :
            | raison sociale du gestionnaire réseau | Arc Energies Maurienne |
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Arc Energies Maurienne"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement avec dossier
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le porteur modifie le gestionnaire de réseau du projet avec :
            | raison sociale du gestionnaire réseau | Arc Energies Maurienne |
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Arc Energies Maurienne"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement avec plusieurs dossiers
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Et une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Quand le porteur modifie le gestionnaire de réseau du projet avec :
            | raison sociale du gestionnaire réseau | Arc Energies Maurienne |
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Arc Energies Maurienne"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement avec un gestionnaire non référencé
        Quand le porteur modifie le gestionnaire de réseau du projet avec un gestionnaire non référencé
        Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau inconnu d'un raccordement pour un projet achevé
        Etant donné le gestionnaire de réseau inconnu attribué au raccordement du projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Quand le porteur modifie le gestionnaire de réseau du projet avec :
            | raison sociale du gestionnaire réseau | Arc Energies Maurienne |
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Arc Energies Maurienne"

    Scénario: Un administrateur modifie le gestionnaire de réseau inconnu d'un raccordement pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand l'administrateur modifie le gestionnaire de réseau du projet avec :
            | raison sociale du gestionnaire réseau | Arc Energies Maurienne |
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Arc Energies Maurienne"

    Scénario: Le système modifie le gestionnaire de réseau d'un raccordement avec un gestionnaire inconnu
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le système modifie le gestionnaire de réseau du projet avec un gestionnaire inconnu
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau inconnu

    Scénario: Un porteur de projet peut transmettre une demande complète de raccordemnent pour son nouveau gestionnaire de projet
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Quand le porteur modifie le gestionnaire de réseau du projet avec :
            | raison sociale du gestionnaire réseau | Arc Energies Maurienne |
        Et le porteur transmet une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Alors le projet lauréat devrait avoir 2 dossiers de raccordement
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat

    Scénario: Une tâche est ajoutée lorsqu'un raccordement est modifié avec un gestionnaire réseau inconnu
        Et une demande complète de raccordement pour le projet lauréat
        Quand le système modifie le gestionnaire de réseau du projet avec un gestionnaire inconnu
        Alors une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est achevée lorsqu'un raccordement est modifié avec un gestionnaire réseau valide
        Etant donné une tâche indiquant de "mettre à jour le gestionnaire de réseau" pour le projet lauréat avec gestionnaire inconnu
        Quand le porteur modifie le gestionnaire de réseau du projet avec :
            | raison sociale du gestionnaire réseau | Enedis |
        Alors une tâche indiquant de "mettre à jour le gestionnaire de réseau" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Plan du scénario: Impossible pour un profil non admin de modifier le gestionnaire de réseau d'un raccordement si le projet est achevé
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Quand <role> modifie le gestionnaire de réseau du projet avec :
            | raison sociale du gestionnaire réseau | Arc Energies Maurienne |
        Alors <role> devrait être informé que "Impossible de faire un changement pour un projet achevé"

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |

    Plan du scénario: Impossible pour un profil non admin de modifier le gestionnaire de réseau d'un raccordement si le projet a un dossier avec date de mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand <role> modifie le gestionnaire de réseau du projet avec :
            | raison sociale du gestionnaire réseau | Arc Energies Maurienne |
        Alors <role> devrait être informé que "Le gestionnaire de réseau ne peut être modifié car le raccordement a une date de mise en service"

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |
