#Language: fr-FR
Fonctionnalité: Modifier une demande complète de raccordement
    
    # SCENARIO-01 - Erreur lors de l'enregistrement du nouveau fichier (timeout) - fonctionne en local
    Scénario: Un porteur de projet modifie la date de qualification d'une demande complète de raccordement
        Etant donné un dossier de raccordement
        Quand le porteur modifie la date de qualification d'un dossier de raccordement
        Alors l'accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet  

    # SCENARIO-02 - Erreur lors de l'enregistrement du nouveau fichier (timeout)
    @selection
    Scénario: Un porteur de projet modifie une demande complète de raccordement
        Etant donné un dossier de raccordement
        Quand le porteur modifie une demande complète de raccordement
        Alors l'accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet

    # SCENARIO-03 
    Scénario: Un porteur de projet modifie une demande complète de raccordement ayant une proposition technique et financière
        Etant donné un dossier de raccordement ayant une proposition technique et financière
        Quand le porteur modifie une demande complète de raccordement
        Alors l'accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet
        Et la proposition technique et financière devrait être consultable dans le dossier de raccordement         

    # SCENARIO-04 -> Si besoin, faire dans la partie adapter (infra) avec un test d'intégration
    # Scénario: Un porteur de projet modifie une demande complète de raccordement avec une référence différente du dossier de raccordement et un accusé de réception identique
    #     Etant donné un dossier de raccordement
    #     Quand le porteur modifie une demande complète de raccordement avec une référence du dossier de raccordement différente et un accusé de réception identique
    #     Alors l'accusé de réception devrait être mis à jour avec le nouveau chemin d'accès
    #     Et le dossier est consultable dans la liste des dossiers de raccordement du projet     
  

    # SCENARIO-05 ->  Si besoin, faire dans la partie adapter (infra) avec un test d'intégration
    # Scénario: Un porteur de projet modifie une demande complète de raccordement avec la même référence du dossier de raccordement mais un accusé de réception différent
    #     Etant donné un dossier de raccordement
    #     Quand le porteur modifie une demande complète de raccordement avec la même référence mais un accusé de réception différent
    #     Alors l'accusé de réception devrait être mis à jour 
    #     Et le dossier est consultable dans la liste des dossiers de raccordement du projet    
        
    # SCENARIO-06
    Scénario: Impossible de modifier la date de qualification pour un dossier de raccordement non connu
        Quand un administrateur modifie la date de qualification pour un dossier de raccordement non connu
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"       