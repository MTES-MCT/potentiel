#Language: fr-FR
Fonctionnalité: Modifier la référence d'une demande complète de raccordement
    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"

    Scénario: Modifier la référence d'une demande complète de raccordement
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement "OUE-RP-2022-000033" avec la référence "OUE-RP-2022-000034"
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement
    
    Scénario: Modifier en tant qu'administrateur la référence d'une demande complète de raccordement pour un dossier ayant déjà une date de mise en service 
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une date de mise en service "2022-01-12" pour le dossier de raccordement "OUE-RP-2022-000033"
        Quand l'utilisateur avec le rôle "admin" modifie la demande complète de raccordement "OUE-RP-2022-000033" avec la référence "OUE-RP-2022-000034"
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement

    Scénario: Modifier un dossier de raccordement suite à la modification de la référence
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement "OUE-RP-2022-000033" avec la référence "OUE-RP-2022-000034"
        Et le porteur modifie la demande complète de raccordement ayant pour référence "OUE-RP-2022-000034" avec :
            | La date de qualification            | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-29 |
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement

    Scénario: Modifier la référence d'une demande complète de raccordement ayant une PTF
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une propositon technique et financière pour le dossier de raccordement ayant pour référence "OUE-RP-2022-000033" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement "OUE-RP-2022-000033" avec la référence "OUE-RP-2022-000034"
        Alors la proposition technique et financière signée devrait être consultable dans le dossier de raccordement

    Scénario: Impossible de modifier une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau
        Etant donné un gestionnaire de réseau
            | Code EIC             | 17X0000009352859 |
            | Raison sociale       | RTE              |
            | Expression régulière | ^[a-zA-Z]{3}$    |
        Et un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "RTE" avec :
            | La date de qualification                | 2022-10-28                                                                             |
            | La référence du dossier de raccordement | ABC                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                        |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence ABC et la date de qualification au 2022-10-28 |
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement "ABC" avec la référence "UneRéférenceAvecUnFormatInvalide"
        Alors le porteur devrait être informé que "Le format de la référence du dossier de raccordement est invalide"

    Scénario: Impossible de modifier la référence pour un projet sans dossier de raccordement
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement "OUE-RP-2022-000033" avec la référence "OUE-RP-2022-000034"
        Alors le porteur devrait être informé que "Le dossier de raccordement n'est pas référencé"

    Scénario: Impossible de modifier la référence pour un dossier de raccordement non référencé
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement "OUE-RP-2022-000034" avec la référence "OUE-RP-2022-000035"
        Alors le porteur devrait être informé que "Le dossier de raccordement n'est pas référencé"

    Scénario: Impossible pour un porteur de modifier la référence pour un dossier de raccordement ayant déjà une date de mise en service
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une date de mise en service "2022-01-12" pour le dossier de raccordement "OUE-RP-2022-000033"
        Quand l'utilisateur avec le rôle "porteur-projet" modifie la demande complète de raccordement "OUE-RP-2022-000033" avec la référence "OUE-RP-2022-000034"
        Alors le porteur devrait être informé que "La référence du dossier de raccordement ne peut pas être modifiée car le dossier dispose déjà d'une date de mise en service"