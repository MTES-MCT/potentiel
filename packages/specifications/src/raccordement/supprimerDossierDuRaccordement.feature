# language: fr
Fonctionnalité: Supprimer un dossier du raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et une demande complète de raccordement pour le projet lauréat transmise auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une proposition technique et financière pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |

    Scénario: Un porteur supprime un dossier du raccordement d'un projet
        Quand le porteur supprime le dossier ayant pour référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat
        Alors le dossier ayant pour référence "OUE-RP-2022-000033" ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet

    Scénario: Impossible de supprimer un dossier non référencé dans le raccordement du projet
        Quand le porteur supprime le dossier ayant pour référence "OUE-RP-2022-000034" du raccordement pour le projet lauréat
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de supprimer un dossier ayant déjà une date de mise en service
        Etant donné une date de mise en service "2024-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat
        Quand le porteur supprime le dossier ayant pour référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat
        Alors le porteur devrait être informé que "Un dossier avec une date de mise en service ne peut pas être supprimé"
