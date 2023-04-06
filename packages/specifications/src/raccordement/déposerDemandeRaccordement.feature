#language: fr-FR
Fonctionnalité: Déposer une demande de raccordement

Scénario: Un porteur de projet dépose une demande de raccordement pour son projet
    Etant donné un projet
    Quand le porteur du projet dépose une demande de raccordement auprès du gestionnaire de réseau "Enedis"
    Alors le projet devrait avoir un dossier de raccordement pour le gestionnaire de réseau "Enedis"
    Et le dossier est consultable dans la liste des demandes de raccordement du projet 
