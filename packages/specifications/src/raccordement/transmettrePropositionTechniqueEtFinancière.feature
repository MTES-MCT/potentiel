#Language: fr-FR
Fonctionnalité: Transmettre une proposition technique et financière
    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"

    @select
    Scénario: Un porteur de projet transmet une proposition technique et financière pour ce dossier de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Alors la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033"

    @select
    Scénario: Impossible de transmettre une proposition technique et financière pour un projet sans dossier de raccordement
        Quand le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000033" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Alors le porteur devrait être informé que "Aucun raccordement pour le projet lauréat"

    @select
    Scénario: Impossible de transmettre une proposition technique et financière pour un dossier de raccordement non référencé
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000034" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000034 avec une date de signature au 2023-01-10 |
        Alors le porteur devrait être informé que "Le dossier de raccordement n'est pas référencé"

    @select
    Scénario: Impossible de transmettre une proposition technique et financière avec une date de signature dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat "Du boulodrome de Marseille" ayant pour référence "OUE-RP-2022-000034" avec :
            | La date de signature                                | 2999-12-31                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"