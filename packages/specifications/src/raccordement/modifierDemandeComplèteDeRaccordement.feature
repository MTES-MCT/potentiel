#Language: fr-FR
Fonctionnalité: Modifier une demande complète de raccordement

    Scénario: Un porteur de projet modifie la date de qualification d'un dossier de raccordement
    Etant donné un dossier de raccordement
        Quand le porteur modifie la date de qualification
        Alors la date de qualification du dossier de raccordement devrait être consultable

    Scénario: Impossible de modifier la date de qualification pour un dossier de raccordement non connu
        Quand le porteur modifie la date de qualification pour un dossier de raccordement non connu
        Alors le porteur devrait être informé que "Le dossier de raccordement n'existe pas"