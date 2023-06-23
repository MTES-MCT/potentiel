#Language: fr-FR
Fonctionnalité: Déclarer le gestionnaire de réseau d'un projet
    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"

    Scénario: Le gestionnaire de réseau est déclaré pour le projet lorsque la première demande de raccordement est transmise
        Quand le porteur d'un projet transmet une demande complète de raccordement auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Alors le gestionaire de réseau 'Enedis' devrait être consultable dans le projet