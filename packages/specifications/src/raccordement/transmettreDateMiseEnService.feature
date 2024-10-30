# language: fr
Fonctionnalité: Transmettre une date de mise en service pour une demande complète de raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"

    Scénario: Le porteur transmet une date de mise en service pour un dossier de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
        Alors la date de mise en service "2023-03-27" devrait être consultable dans le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"

    Scénario: Impossible de transmettre une date de mise en service pour un projet sans dossier de raccordement
        Quand le porteur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
        Alors le porteur devrait être informé que "Raccordement inconnu"

    Scénario: Impossible de transmettre une date de mise en service pour un dossier n'étant pas référencé dans le raccordement du projet
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000034"
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de transmettre une date de mise en service dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet la date de mise en service "2999-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible de transmettre une date de mise en service antérieure à la date de notification du projet
        Etant donné le projet lauréat "Du boulodrome de Lille" ayant été notifié le "2022-10-26"
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Lille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet la date de mise en service "2021-12-31" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Lille" ayant pour référence "OUE-RP-2022-000033"
        Alors le porteur devrait être informé que "La date de mise en service ne peut pas être antérieure à la date de désignation du projet"

    Scénario: Impossible de transmettre une date de mise en service plus d'une fois
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
        Et le porteur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement du le projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"
        Alors le porteur devrait être informé que "La date de mise en service est déjà transmise pour ce dossier de raccordement"

    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    @NotImplemented
    Scénario: Impossible de transmettre une date de mise en service si le projet est abandonné


    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    @NotImplemented
    Scénario: Impossible de transmettre une date de mise en service si le projet est éliminé

