#Language: fr-FR
Fonctionnalité: Transmettre une proposition technique et financière

    Scénario: Un porteur de projet transmet une proposition technique et financière pour ce dossier de raccordement
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                      | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement       | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception            | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception           | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur de projet transmet une proposition technique et financière pour le dossier de raccordement ayant pour référence "OUE-RP-2022-000033" avec :
            | La date de signature                                  | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière   | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière     | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Alors la proposition technique et financière signée devrait être consultable dans le dossier de raccordement

    Scénario: Impossible de transmettre une proposition technique et financière pour un projet sans dossier de raccordement
        Quand le porteur de projet transmet une proposition technique et financière pour le dossier de raccordement ayant pour référence "OUE-RP-2022-000033" avec :
            | La date de signature                                  | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière   | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière     | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"
        @selection
    Scénario: Impossible de transmettre une proposition technique et financière pour un dossier de raccordement non référencé
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                      | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement       | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception            | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception           | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur de projet transmet une proposition technique et financière pour le dossier de raccordement ayant pour référence "OUE-RP-2022-000034" avec :
            | La date de signature                                  | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière   | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière     | Proposition technique et financière pour la référence OUE-RP-2022-000034 avec une date de signature au 2023-01-10 |
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 
