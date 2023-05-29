#Language: fr-FR
Fonctionnalité: Modifier une demande complète de raccordement

    # Scénario: Un porteur de projet modifie une demande complète de raccordement
    #     Etant donné un dossier de raccordement
    #     Quand le porteur modifie une demande complète de raccordement
    #     Alors l'accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement
    #     Et le dossier est consultable dans la liste des dossiers de raccordement du projet 
    
    # SCENARIO-01
    Scénario: Un porteur de projet modifie une demande complète de raccordement sans modifier la réference du dossier ni l'accusé de réception
        Etant donné un dossier de raccordement
        Quand le porteur modifie la date de qualification d'un dossier de raccordement sans modifier la réference du dossier ni l'accusé de réception
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet  
        Et l'accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement

    # SCENARIO-02
    @selection
    Scénario: Un porteur de projet modifie une demande complète de raccordement avec une référence différente du dossier de raccordement et un accusé de réception identique
        Etant donné un dossier de raccordement
        Quand le porteur modifie une demande complète de raccordement avec une référence du dossier de raccordement différente et un accusé de réception identique
        Alors l'accusé de réception devrait être mis à jour 
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet     

    # Scénario: Un porteur de projet modifie une demande complète de raccordement avec la même référence du dossier de raccordement mais un accusé de réception ayant un format équivalent à l'existant mais un contenu différent
    #     Etant donné un dossier de raccordement
    #     Quand le porteur modifie une demande complète de raccordement avec un accusé de réception ayant un format équivalent à l'existant mais un contenu différent
    #     Alors l'accusé de réception devrait avoir devrait avoir son contenu mis à jour et il devrait être consultable dans le dossier de raccordement
    #     Et le dossier est consultable dans la liste des dossiers de raccordement du projet    

    # Scénario: Un porteur de projet modifie une demande complète de raccordement avec la même référence du dossier de raccordement mais un accusé de réception ayant un format différent
    #     Etant donné un dossier de raccordement
    #     Quand le porteur modifie une demande complète de raccordement avec un accusé de réception ayant un format différent de celui existant
    #     Alors l'ancien accusé de réception de la demande complète de raccordement devrait être supprimé
    #     Et le nouveau accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement
    #     Et le dossier est consultable dans la liste des dossiers de raccordement du projet          
        
    # SCENARIO-05
    Scénario: Impossible de modifier la date de qualification pour un dossier de raccordement non connu
        Quand un administrateur modifie la date de qualification pour un dossier de raccordement non connu
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 

    # @selection
    # Scénario: Un porteur de projet modifie une demande complète de raccordement sans modifier la réference du dossier
    #     Etant donné un dossier de raccordement
    #     Quand le porteur modifie la date de qualification d'un dossier de raccordement 
    #     Alors l'accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement
    #     Et le dossier est consultable dans la liste des dossiers de raccordement du projet       