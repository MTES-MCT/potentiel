#Language: fr-FR
Fonctionnalité: Modifier la référence d'une demande complète de raccordement

    @notImplmented
    Scénario: Impossible de modifier une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                      | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement       | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception            | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception           | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur modifie une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau
        Alors le porteur devrait être informé que "Le format de la référence du dossier de raccordement est invalide"