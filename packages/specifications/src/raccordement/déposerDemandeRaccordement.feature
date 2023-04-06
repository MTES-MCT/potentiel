#language: fr-FR
Fonctionnalité: Déposer une demande de raccordement

Scénario: Un porteur de projet dépose une demande de raccordement pour son projet
    Etant donné un projet
    Quand le porteur du projet dépose une demande de raccordement auprès du gestionnaire de réseau "Enedis"
    Alors le projet devrait avoir un dossier de raccordement pour le gestionnaire de réseau "Enedis"
    Et le dossier est consultable dans la liste des demandes de raccordement du projet

Scénario: Impossible de déposer une demande de raccordement auprès d'un autre gestionnaire de réseau
    Etant donné un projet avec un demande de raccordement déposée auprès du gestionnaire de réseau "Enedis"
    Quand le porteur du projet dépose une demande de raccordement auprès du gestionnaire de réseau "Électricité de Mayotte"
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
    Et un porteur n'ayant pas accès à ce projet
    Quand le porteur du projet dépose une demande de raccordement auprès du gestionnaire de réseau "Enedis"
    Alors le porteur devrait être informé que "Accès au projet refusé"