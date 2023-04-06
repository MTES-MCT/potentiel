#language: fr-FR
Fonctionnalité: Déposer une demande de raccordement

    Scénario: Un porteur de projet dépose une demande de raccordement pour son projet
        Etant donné un projet
        Quand le porteur du projet dépose une demande de raccordement auprès d'un gestionnaire de réseau
        Alors le projet devrait avoir une demande de raccordement pour ce gestionnaire de réseau
        Et la demande est consultable dans la liste des demandes de raccordement du projet

    Scénario: Impossible de déposer une demande de raccordement auprès d'un autre gestionnaire de réseau
        Etant donné un projet avec un demande de raccordement déposée auprès d'un gestionnaire de réseau
        Quand le porteur du projet dépose une demande de raccordement auprès d'un autre gestionnaire de réseau
        Alors le porteur devrait être informé que "Il est impossible de déposer une demande de raccordement auprès de plusieurs gestionnaires de réseau"

    Scénario: Impossible de déposer une demande de raccordement auprès d'un gestionnaire de réseau inconnu
        Etant donné un projet
        Quand le porteur du projet dépose une demande de raccordement auprès d'un gestionnaire de réseau inconnu
        Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

    Scénario: Impossible de déposer une demande de raccordement pour un projet inconnu
        Quand le porteur du projet dépose une demande de raccordement pour un projet inconnu
        Alors le porteur devrait être informé que "Le projet n'existe pas"

    Scénario: Impossible de déposer une demande de raccordement pour un projet sur lequel le porteur n'a pas les accès
        Etant donné un projet
        Quand le porteur du projet dépose une demande de raccordement auprès d'un gestionnaire de réseau
        Alors le porteur devrait être informé que "Accès au projet refusé"