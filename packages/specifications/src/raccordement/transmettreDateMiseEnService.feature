#Language: fr-FR
Fonctionnalité: Transmettre une date de mise en service pour une demande complète de raccordement

    Scénario: Un administrateur transmet une date de mise en service pour un dossier de raccordement
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                      | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement       | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception            | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception           | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un administrateur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement ayant pour référence "OUE-RP-2022-000033"
        Alors la date de mise en service "2023-03-27" devrait être consultable dans le dossier de raccordement

    Scénario: Impossible de transmettre une date de mise en service pour un projet sans dossier de raccordement
        Quand un administrateur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement ayant pour référence "OUE-RP-2022-000033"
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"

     Scénario: Impossible de transmettre une date de mise en service pour un dossier de raccordement non référencé
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                      | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement       | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception            | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception           | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un administrateur transmet la date de mise en service "2023-03-27" pour le dossier de raccordement ayant pour référence "OUE-RP-2022-000034"
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"