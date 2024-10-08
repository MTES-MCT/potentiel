# language: fr
Fonctionnalité: Modifier le gestionnaire de réseau d'un raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le gestionnaire de réseau "Arc Energies Maurienne"
        Et le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec le gestionnaire "Arc Energies Maurienne"
        Alors le projet "Du boulodrome de Marseille" devrait avoir un raccordement attribué au gestionnaire de réseau "Arc Energies Maurienne"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement avec un gestionnaire non référencé
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec un gestionnaire non référencé
        Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

    Scénario: Le système modifie le gestionnaire de réseau d'un raccordement avec un gestionnaire inconnu
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le système modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec un gestionnaire inconnu
        Alors le projet "Du boulodrome de Marseille" devrait avoir un raccordement attribué au gestionnaire de réseau inconnu

    Scénario: Un porteur de projet peut transmettre une demande compléte de raccordemnent pour son nouveau gestionnaire de projet
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec le gestionnaire "Arc Energies Maurienne"
        Et le porteur transmet une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" auprès du gestionnaire de réseau "Arc Energies Maurienne" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000034                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-28 |
        Alors le projet lauréat "Du boulodrome de Marseille" devrait avoir 2 dossiers de raccordement pour le gestionnaire de réseau "Arc Energies Maurienne"
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat "Du boulodrome de Marseille"

    Scénario: Impossible pour un porteur de projet de modifier le gestionnaire de réseau d'un raccordement avec mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une date de mise en service "2023-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Quand un porteur modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec le gestionnaire "Arc Energies Maurienne"
        Alors le porteur devrait être informé que "Le gestionnaire de réseau ne peut être modifié car le raccordement a une date de mise en service"

    Scénario: Impossible pour une dreal de modifier le gestionnaire de réseau d'un raccordement avec mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une date de mise en service "2023-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Quand une dreal modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec le gestionnaire "Arc Energies Maurienne"
        Alors la dreal devrait être informé que "Le gestionnaire de réseau ne peut être modifié car le raccordement a une date de mise en service"
