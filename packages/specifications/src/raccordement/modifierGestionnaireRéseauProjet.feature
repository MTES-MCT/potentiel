#Language: fr-FR
Fonctionnalité: Modifier le gestionnaire de réseau d'un projet

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un projet
    Etant donné un dossier projet avec un gestionnaire de réseau
        Quand le porteur modifie le gestionnaire de réseau avec 'RTE'
        Alors le gestionaire de réseau 'RTE' devrait être consultable dans le projet

    # Scénario: Impossible de modifier la date de qualification pour un dossier de raccordement non connu
    #     Quand un administrateur modifie la date de qualification pour un dossier de raccordement non connu
    #     Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 