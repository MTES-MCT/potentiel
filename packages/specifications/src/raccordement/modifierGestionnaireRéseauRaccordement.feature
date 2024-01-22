#Language: fr-FR
Fonctionnalité: Modifier le gestionnaire de réseau d'un raccordement
    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le gestionnaire de réseau "Arc Energies Maurienne"
        Et le projet lauréat "Du boulodrome de Marseille"

    @select
    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec le gestionnaire "Arc Energies Maurienne"
        Alors le projet "Du boulodrome de Marseille" devrait avoir comme gestionnaire de réseau "Arc Energies Maurienne"

    @select
    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un raccordement avec un gestionnaire non référencé
        Etant donné une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand un porteur modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec un gestionnaire non référencé
        Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

