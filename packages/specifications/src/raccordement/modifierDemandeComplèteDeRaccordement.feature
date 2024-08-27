# language: fr
@select
Fonctionnalité: Modifier une demande complète de raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur de projet modifie une demande complète de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification            | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-29 |
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat "Du boulodrome de Marseille"
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat "Du boulodrome de Marseille"

    Scénario: Une dreal modifie une demande complète de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand l'utilisateur avec le rôle "dreal" modifie la demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification            | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-29 |
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat "Du boulodrome de Marseille"
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat "Du boulodrome de Marseille"

    Scénario: Impossible de modifier une demande complète de raccordement pour un projet sans dossier de raccordement
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification            | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-29 |
        Alors le porteur devrait être informé que "Raccordement inconnu"

    Scénario: Impossible de modifier une demande complète de raccordement pour un dossier n'étant pas référencé dans le raccordement du projet
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000034" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification            | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-29 |
        Alors le porteur devrait être informé que "Le dossier du raccordement pour ce projet n'est pas référencé"

    Scénario: Impossible de modifier une demande complète de raccordement avec une date de qualification dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000034" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification            | 2999-12-31                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-29 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible pour un porteur de modifier une demande complète de raccordement si le projet est déjà en service
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une date de mise en service "2023-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification            | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-29 |
        Alors le porteur devrait être informé que "La demande complète de raccordement du dossier OUE-RP-2022-000033 ne peut pas être modifiée car celui-ci dispose déjà d'une date de mise en service"

    Scénario: Impossible pour une dreal de modifier une demande complète de raccordement si le projet est déjà en service
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une date de mise en service "2023-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Quand l'utilisateur avec le rôle "dreal" modifie la demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033" auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification            | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-29 |
        Alors la dreal devrait être informé que "La demande complète de raccordement du dossier OUE-RP-2022-000033 ne peut pas être modifiée car celui-ci dispose déjà d'une date de mise en service"
