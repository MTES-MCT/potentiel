# language: fr
Fonctionnalité: Transmettre une demande complète de raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le DGEC validateur "Robert Robichet"
        Et le projet lauréat "Du boulodrome de Marseille" V2
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    @select
    Scénario: Un porteur de projet transmet une demande complète de raccordement pour son projet
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat "Du boulodrome de Marseille"
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat "Du boulodrome de Marseille"
        Et le projet "Du boulodrome de Marseille" devrait avoir un raccordement attribué au gestionnaire de réseau "Enedis"

    Scénario: Un porteur de projet transmet plusieurs demandes complètes de raccordement pour son projet
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000034                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-28 |
        Et le porteur transmet une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000035                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-28 |
        Alors le projet lauréat "Du boulodrome de Marseille" devrait avoir 2 dossiers de raccordement pour le gestionnaire de réseau "Enedis"

    Scénario: Un porteur de projet transmet plusieurs demandes complètes de raccordement ayant la même référence
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Alors le porteur devrait être informé que "Il est impossible d'avoir plusieurs dossiers de raccordement avec la même référence pour un projet"

    Scénario: Impossible de transmettre une demande complète de raccordement auprès d'un autre gestionnaire de réseau
        Etant donné un gestionnaire de réseau
            | Code EIC       | 17X0000009352859       |
            | Raison sociale | Arc Energies Maurienne |
        Et une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Arc Energies Maurienne" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000034                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-28 |
        Alors le porteur devrait être informé que "Il est impossible de transmettre une demande complète de raccordement auprès de plusieurs gestionnaires de réseau"

    Scénario: Impossible de transmettre une demande complète de raccordement auprès d'un gestionnaire de réseau non référencé
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" auprès du gestionnaire de réseau "Inconnu" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000034                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-28 |
        Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

    Scénario: Impossible de transmettre une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau
        Etant donné un gestionnaire de réseau
            | Code EIC             | 17X0000009352859 |
            | Raison sociale       | RTE              |
            | Expression régulière | ^[a-zA-Z]{3}$    |
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" auprès du gestionnaire de réseau "RTE" avec :
            | La date de qualification                | 2022-10-28                                                                                                          |
            | La référence du dossier de raccordement | UneRéférenceAvecUnFormatInvalide                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                                     |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence UneRéférenceAvecUnFormatInvalide et la date de qualification au 2022-10-28 |
        Alors le porteur devrait être informé que "Le format de la référence du dossier de raccordement est invalide"

    Scénario: Impossible de transmettre une demande complète de raccordement avec une date de qualification dans le futur
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2999-12-31                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible de transmettre une demande complète de raccordement si le projet est abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Alors le porteur devrait être informé que "Il est impossible de transmettre une demande complète de raccordement pour un projet abandonné"

    @select
    Scénario: Impossible de transmettre une demande complète de raccordement si le projet est éliminé
        Etant donné le projet éliminé "Du boulodrome de Marseille"
        Quand le porteur transmet une demande complète de raccordement pour le projet éliminé "Du boulodrome de Marseille" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Alors le porteur devrait être informé que "Il est impossible de transmettre une demande complète de raccordement pour un projet éliminé"
