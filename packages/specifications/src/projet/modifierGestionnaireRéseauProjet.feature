#Language: fr-FR
Fonctionnalité: Modifier le gestionnaire de réseau d'un projet
    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet "Du boulodrome de Marseille"

    @selection
    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un projet
        Etant donné le gestionnaire de réseau "Arc Energies Maurienne"
        Et une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" pour le projet "Du boulodrome de Marseille"
        Quand un porteur modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec le gestionnaire "Arc Energies Maurienne"
        Alors le projet "Du boulodrome de Marseille" devrait avoir comme gestionaire de réseau "Arc Energies Maurienne"

    Scénario: Un porteur de projet peut transmettre une demande compléte de raccordemnent pour son nouveau gestionnaire de projet
        Etant donné le gestionnaire de réseau "Arc Energies Maurienne"
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur modifie le gestionnaire de réseau de son projet avec un gestionnaire ayant le code EIC '17X0000009352859'
        Et le porteur d'un projet transmet une demande complète de raccordement auprès du gestionnaire de réseau "Arc Energies Maurienne" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000034                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000034 et la date de qualification au 2022-10-28 |
        Alors le projet devrait avoir 2 dossiers de raccordement pour ce gestionnaire de réseau
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un projet avec un gestionnaire non référencé
        Etant donné une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" pour le projet "Du boulodrome de Marseille"
        Quand un porteur modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec un gestionnaire non référencé
        Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

