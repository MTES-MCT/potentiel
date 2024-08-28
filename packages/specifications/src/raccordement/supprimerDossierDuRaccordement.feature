# language: fr
Fonctionnalité: Supprimer un dossier du raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une proposition technique et financière pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |

    Plan du scénario: Un utilisateur autorisé supprime un dossier du raccordement d'un projet
        Quand l'utilisateur "<Role autorisé>" supprime le dossier ayant pour référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Alors le dossier ayant pour référence "OUE-RP-2022-000033" ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet "Du boulodrome de Marseille"

        Exemples:
            | Role autorisé   |
            | porteur-projet  |
            | admin           |
            | dgec-validateur |

    Plan du scénario: Impossible de supprimer un dossier du raccordement d'un projet pour un rôle non autorisé
        Quand l'utilisateur "<Role non autorisé>" supprime le dossier ayant pour référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Alors l'utilisateur "<Role non autorisé>" devrait être informé que "Vous n'avez pas l'autorisation de supprimer un dossier du raccordement"

        Exemples:
            | Role non autorisé |
            | dreal             |
            | acheteur-obligé   |
            | ademe             |
            | caisse-des-dépôts |
            | cre               |

    Scénario: Impossible de supprimer un dossier non référencé dans le raccordement du projet
        Quand l'utilisateur "porteur-projet" supprime le dossier ayant pour référence "OUE-RP-2022-000034" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Alors l'utilisateur "porteur-projet" devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de supprimer un dossier ayant déjà une date de mise en service
        Etant donné une date de mise en service "2024-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Quand l'utilisateur "admin" supprime le dossier ayant pour référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Alors l'utilisateur "admin" devrait être informé que "Un dossier avec une date de mise en service ne peut pas être supprimé"
