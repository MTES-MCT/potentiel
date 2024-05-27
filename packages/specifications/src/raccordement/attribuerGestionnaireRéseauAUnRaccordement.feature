#Language: fr-FR
Fonctionnalité: Attribuer un gestionnaire de réseau à un raccordement 
    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"

    # TODO Violette 
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
