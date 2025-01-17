# language: fr
Fonctionnalité: Transmettre une proposition technique et financière

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur de projet transmet une proposition technique et financière pour ce dossier de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat ayant pour référence "OUE-RP-2022-000033" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Alors la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat ayant pour référence "OUE-RP-2022-000033"

    Scénario: Impossible de transmettre une proposition technique et financière pour un projet sans dossier de raccordement
        Quand le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat ayant pour référence "OUE-RP-2022-000033" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de transmettre une proposition technique et financière pour un dossier n'étant pas référencé dans le raccordement du projet
        Etant donné une demande complète de raccordement pour le projet lauréat auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat ayant pour référence "OUE-RP-2022-000034" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000034 avec une date de signature au 2023-01-10 |
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de transmettre une proposition technique et financière avec une date de signature dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat auprès du gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat ayant pour référence "OUE-RP-2022-000034" avec :
            | La date de signature                                | 2999-12-31                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    @NotImplemented
    Scénario: Impossible de transmettre une proposition technique et financière si le projet est abandonné


    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    @NotImplemented
    Scénario: Impossible de transmettre une proposition technique et financière si le projet est éliminé

