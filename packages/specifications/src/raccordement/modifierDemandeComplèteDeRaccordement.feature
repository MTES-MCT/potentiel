#Language: fr-FR
@select
Fonctionnalité: Modifier une demande complète de raccordement
    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet "Du boulodrome de Marseille"

    Scénario: Un porteur de projet modifie une demande complète de raccordement
        Etant donné une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" pour le projet "Du boulodrome de Marseille" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie la demande complète de raccordement "OUE-RP-2022-000033" du projet "Du boulodrome de Marseille" avec :
            | La date de qualification            | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-29 |
        Alors la demande complète de raccordement devrait être à jour dans le dossier de raccordement "OUE-RP-2022-000033" du projet "Du boulodrome de Marseille"

    Scénario: Impossible de modifier une demande complète de raccordement pour un projet sans dossier de raccordement
        Quand un porteur modifie la demande complète de raccordement "OUE-RP-2022-000033" du projet "Du boulodrome de Marseille" avec :
            | La date de qualification            | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-29 |
        Alors le porteur devrait être informé que "Le dossier de raccordement n'est pas référencé"

    Scénario: Impossible de modifier une demande complète de raccordement pour un dossier de raccordement non référencé
        Etant donné une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" pour le projet "Du boulodrome de Marseille" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie la demande complète de raccordement "OUE-RP-2022-000034" du projet "Du boulodrome de Marseille" avec :
            | La date de qualification            | 2022-10-29                                                                                                      |
            | Le format de l'accusé de réception  | text/plain                                                                                                      |
            | Le contenu de l'accusé de réception | Une autre accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-29 |
        Alors le porteur devrait être informé que "Le dossier de raccordement n'est pas référencé"

    Scénario: Impossible de modifier une demande complète de raccordement avec une date de qualification dans le futur
        Etant donné une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" pour le projet "Du boulodrome de Marseille" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie la demande complète de raccordement "OUE-RP-2022-000033" du projet "Du boulodrome de Marseille" avec une date dans le futur :
            | La date de qualification | 2999-12-31 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"
