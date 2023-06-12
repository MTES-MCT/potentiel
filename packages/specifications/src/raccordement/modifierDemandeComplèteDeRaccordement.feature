#Language: fr-FR
Fonctionnalité: Modifier une demande complète de raccordement
    
    @notWorking
    Scénario: Un porteur de projet modifie la date de qualification d'une demande complète de raccordement
        Etant donné un dossier de raccordement
        Quand le porteur modifie la date de qualification d'un dossier de raccordement
        Alors l'accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet  

    @notWorking
    Scénario: Un porteur de projet modifie une demande complète de raccordement
        Etant donné un dossier de raccordement
        Quand le porteur modifie une demande complète de raccordement
        Alors l'accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet

    @working
    Scénario: Impossible de modifier la date de qualification pour un dossier de raccordement non connu
        Quand un administrateur modifie la date de qualification pour un dossier de raccordement non connu
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"       

    @notWorking
    Scénario: Impossible de modifier une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau
        Etant donné un dossier de raccordement
        Quand le porteur modifie une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau
        Alors le porteur devrait être informé que "Le format de la référence du dossier de raccordement est invalide"