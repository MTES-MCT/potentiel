#Language: fr-FR
Fonctionnalité: Modifier une demande complète de raccordement

    Scénario: Un porteur de projet modifie une demande complète de raccordement
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                      | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement       | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception            | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception           | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur modifie la demande complète de raccordement ayant pour référence "OUE-RP-2022-000033" avec :
            | La date de qualification                      | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception            | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception           | Une autre accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-29 |
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement

    Scénario: Impossible de modifier une demande complète de raccordement pour un projet sans dossier de raccordement
        Quand le porteur modifie la demande complète de raccordement ayant pour référence "OUE-RP-2022-000033" avec :
            | La date de qualification                      | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception            | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception           | Une autre accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-29 |
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"       

    Scénario: Impossible de modifier une demande complète de raccordement pour un dossier de raccordement non référencé
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                      | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement       | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception            | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception           | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur modifie la demande complète de raccordement ayant pour référence "OUE-RP-2022-000034" avec :
            | La date de qualification                      | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception            | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception           | Une autre accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-29 |
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"       
