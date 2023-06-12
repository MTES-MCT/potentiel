#Language: fr-FR
Fonctionnalité: Modifier le gestionnaire de réseau d'un projet
    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un projet
        Etant donné un gestionnaire de réseau
            | Code EIC       | 17X0000009352859       |
            | Raison sociale | Arc Energies Maurienne |
        Et un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                      | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement       | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception            | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception           | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur modifie le gestionnaire de réseau de son projet avec un gestionnaire ayant le code EIC '17X0000009352859'
        Alors le gestionaire de réseau 'Arc Energies Maurienne' devrait être consultable dans le projet
     Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un projet avec un gestionnaire non référencé
        Etant donné un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                      | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement       | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception            | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception           | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le porteur modifie le gestionnaire de réseau de son projet avec un gestionnaire ayant le code EIC '17X0000009352859'
        Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé" 