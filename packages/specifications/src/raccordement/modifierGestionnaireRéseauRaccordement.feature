# language: fr
Fonctionnalité: Modifier le gestionnaire de réseau d'un raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le référentiel ORE
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Arc Energies Maurienne"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement
        Quand un porteur modifie le gestionnaire de réseau du projet avec le gestionnaire "Arc Energies Maurienne"
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Arc Energies Maurienne"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement avec dossier
        Etant donné une demande complète de raccordement pour le projet lauréat transmise auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie le gestionnaire de réseau du projet avec le gestionnaire "Arc Energies Maurienne"
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Arc Energies Maurienne"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement avec plusieurs dossiers
        Etant donné une demande complète de raccordement pour le projet lauréat transmise auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Etant donné une demande complète de raccordement pour le projet lauréat transmise auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000034                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie le gestionnaire de réseau du projet avec le gestionnaire "Arc Energies Maurienne"
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Arc Energies Maurienne"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement avec un gestionnaire non référencé
        Quand un porteur modifie le gestionnaire de réseau du projet avec un gestionnaire non référencé
        Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

    Scénario: Le système modifie le gestionnaire de réseau d'un raccordement avec un gestionnaire inconnu
        Etant donné une demande complète de raccordement pour le projet lauréat transmise auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le système modifie le gestionnaire de réseau du projet avec un gestionnaire inconnu
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau inconnu

    Scénario: Un porteur de projet peut transmettre une demande complète de raccordemnent pour son nouveau gestionnaire de projet
        Etant donné une demande complète de raccordement pour le projet lauréat transmise auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie le gestionnaire de réseau du projet avec le gestionnaire "Arc Energies Maurienne"
        Et le porteur transmet une demande complète de raccordement pour le projet lauréat auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000034                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-28 |
        Alors le projet lauréat devrait avoir 2 dossiers de raccordement pour le gestionnaire de réseau "Arc Energies Maurienne"
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat

    Scénario: Impossible pour un porteur de projet de modifier le gestionnaire de réseau d'un raccordement avec mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat transmise auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une date de mise en service "2023-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat
        Quand un porteur modifie le gestionnaire de réseau du projet avec le gestionnaire "Arc Energies Maurienne"
        Alors le porteur devrait être informé que "Le gestionnaire de réseau ne peut être modifié car le raccordement a une date de mise en service"

    Scénario: Impossible pour une dreal de modifier le gestionnaire de réseau d'un raccordement avec mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat transmise auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une date de mise en service "2023-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat
        Quand une dreal modifie le gestionnaire de réseau du projet avec le gestionnaire "Arc Energies Maurienne"
        Alors la dreal devrait être informé que "Le gestionnaire de réseau ne peut être modifié car le raccordement a une date de mise en service"

    Scénario: Une tâche est ajoutée lorsqu'un raccordement est modifié avec un gestionnaire réseau inconnu
        Et une demande complète de raccordement pour le projet lauréat transmise auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le système modifie le gestionnaire de réseau du projet avec un gestionnaire inconnu
        Alors une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est achevée lorsqu'un raccordement est modifié avec un gestionnaire réseau valide
        Etant donné une tâche indiquant de "mettre à jour le gestionnaire de réseau" pour le projet lauréat avec gestionnaire inconnu
        Quand un porteur modifie le gestionnaire de réseau du projet avec le gestionnaire "Enedis"
        Alors une tâche indiquant de "mettre à jour le gestionnaire de réseau" n'est plus consultable dans la liste des tâches du porteur pour le projet
