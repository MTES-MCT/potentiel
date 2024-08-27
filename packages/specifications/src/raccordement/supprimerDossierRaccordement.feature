# language: fr
Fonctionnalité: Supprimer un dossier du raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"

    @select
    Plan du scénario: Un utilisateur autorisé supprime un dossier du raccordement d'un projet
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une proposition technique et financière pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Quand l'utilisateur "<Role autorisé>" supprime le dossier ayant pour référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Alors le dossier ayant pour référence "OUE-RP-2022-000033" ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet "Du boulodrome de Marseille"

        Exemples:
            | Role autorisé  |
            | porteur-projet |
            | admin          |

    @NotImplemented
    Scénario: Impossible de supprimer un dossier non référencé dans le raccordement du projet
        Quand l'utilisateur porteur-projet supprime le dossier ayant pour référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille" avec :
        Alors l'utilisateur porteur-projet devrait être informé que "Le dossier du raccordement pour ce projet n'est pas référencé"

    @NotImplemented
    Scénario: Impossible de supprimer un dossier ayant déjà une date de mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une proposition technique et financière pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Et une date de mise en service "2024-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Quand l'utilisateur admin supprime le dossier ayant pour référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille" avec :
        Alors l'utilisateur admin devrait être informé que "Le dispose disponible d'une date de mise en service, et ne peut donc pas être supprimé"


# Scénario: Le porteur transmet une date de mise en service pour un dossier de raccordement
#     Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
#         | La date de qualification                | 2022-10-28                                                                                            |
#         | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
#         | Le format de l'accusé de réception      | application/pdf                                                                                       |
#         | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
#     Quand le porteur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
#     Alors la date de mise en service "2023-03-27" devrait être consultable dans le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"

# Scénario: Impossible de transmettre une date de mise en service pour un projet sans dossier de raccordement
#     Quand le porteur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
#     Alors le porteur devrait être informé que "Raccordement inconnu"

# Scénario: Impossible de transmettre une date de mise en service pour un dossier de raccordement non référencé
#     Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
#         | La date de qualification                | 2022-10-28                                                                                            |
#         | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
#         | Le format de l'accusé de réception      | application/pdf                                                                                       |
#         | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
#     Quand le porteur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000034"
#     Alors le porteur devrait être informé que "Le dossier du raccordement pour ce projet n'est pas référencé"

# Scénario: Impossible de transmettre une date de mise en service dans le futur
#     Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
#         | La date de qualification                | 2022-10-28                                                                                            |
#         | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
#         | Le format de l'accusé de réception      | application/pdf                                                                                       |
#         | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
#     Quand le porteur transmet la date de mise en service "2999-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
#     Alors le porteur devrait être informé que "La date ne peut pas être une date future"

# Scénario: Impossible de transmettre une date de mise en service antérieure à la date de notification du projet
#     Etant donné le projet lauréat "Du boulodrome de Lille" avec :
#         | La date de désignation | 2022-10-27 |
#     Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Lille" transmise auprès du gestionnaire de réseau "Enedis" avec :
#         | La date de qualification                | 2022-10-28                                                                                            |
#         | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
#         | Le format de l'accusé de réception      | application/pdf                                                                                       |
#         | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
#     Quand le porteur transmet la date de mise en service "2021-12-31" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Lille" ayant pour référence "OUE-RP-2022-000033"
#     Alors le porteur devrait être informé que "La date de mise en service ne peut pas être antérieure à la date de désignation du projet"

# Scénario: Impossible de transmettre une date de mise en service plus d'une fois
#     Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
#         | La date de qualification                | 2022-10-28                                                                                            |
#         | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
#         | Le format de l'accusé de réception      | application/pdf                                                                                       |
#         | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
#     Quand le porteur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
#     Et le porteur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
#     Alors le porteur devrait être informé que "La date de mise en service est déjà transmise pour ce dossier de raccordement"

# # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
# @NotImplemented
# Scénario: Impossible de transmettre une date de mise en service si le projet est abandonné

# # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
# @NotImplemented
# Scénario: Impossible de transmettre une date de mise en service si le projet est éliminé