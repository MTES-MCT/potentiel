#language: fr-FR
Fonctionnalité: Réceptionner une demande de raccordement
    @ÀRaffiner
    Scénario: Un gestionnaire de réseau * une demande complète de raccordement 
        Etant donné une demande de raccordement déposée par un porteur
        Quand le gestionnaire de réseau * la demande de raccordement
        Alors la demande de raccordement devrait être complète à la date du "28/10/2022" avec pour identifiant "OUE-RP-2022-000033"

    Scénario: Impossible de * une demande de raccordement inconnue
        Quand le gestionnaire de réseau * une demande de raccordement inconnue
        Alors le gestionnaire de réseau devrait être informé que "La demande de raccordement n'existe pas"
