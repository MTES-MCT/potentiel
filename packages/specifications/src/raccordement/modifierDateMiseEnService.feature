# language: fr
Fonctionnalité: Modifier une date de mise en service pour une demande complète de raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une date de mise en service "2023-03-27" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"

    Scénario: l'admin modifie la date de mise en service pour un dossier de raccordement
        Quand l'admin modifie la date de mise en service "2023-03-28" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
        Alors la date de mise en service "2023-03-28" devrait être consultable dans le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"

    Scénario: Impossible de modifier la date de mise en service pour un projet sans date de mise en service
        Etant donné le projet lauréat "Boulodrome Sainte Livrade"
        Et une demande complète de raccordement pour le projet lauréat "Boulodrome Sainte Livrade" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand l'admin modifie la date de mise en service "2023-03-28" pour le dossier de raccordement du le projet lauréat "Boulodrome Sainte Livrade" ayant pour référence "OUE-RP-2022-000033"
        Alors le porteur devrait être informé que "Aucune date de mise en service n'a encore été transmise"

    Scénario: Impossible de modifier la date de mise en service dans le futur
        Quand l'admin modifie la date de mise en service "2999-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible de modifier la date de mise en service antérieure à la date de notification du projet
        Quand l'admin modifie la date de mise en service "2021-12-31" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
        Alors le porteur devrait être informé que "La date de mise en service ne peut pas être antérieure à la date de désignation du projet"

    Scénario: Impossible de modifier la date de mise en service avec la même date
        Quand l'admin modifie la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
        Alors le porteur devrait être informé que "La date de mise en service est inchangée"
