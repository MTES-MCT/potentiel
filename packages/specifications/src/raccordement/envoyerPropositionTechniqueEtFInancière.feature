#language: fr-FR
Fonctionnalité: Envoyer une proposition technique et financière

    Scénario: Un gestionnaire de réseau envoie une proposition technique et financière pour une demande complète de raccordement
        Etant donné une demande complète de raccordement
        Quand le gestionnaire de réseau envoie une proposition technique et financière pour la demande complète de raccordement avec une date prévisionnelle de mise en service au "28/10/2024"    
        Alors une proposition technique et financière devrait être consultable dans la demande de raccordement avec la date prévisionnelle de mise en service au "28/10/2024"  

    Scénario: Impossible d'envoyer une proposition technique et financière pour une demande de raccordement qui n'est pas complète
        Etant donné une demande de raccordement qui n'est pas complète
        Quand le gestionnaire de réseau envoie une proposition technique et financière pour la demande de raccordement
        Alors le gestionnaire de réseau devrait être informé que "La demande de raccordement n'est pas complète"

    Scénario: Impossible d'envoyer une proposition technique et financière pour une demande de raccordement inconnue
        Quand le gestionnaire de réseau envoie une proposition technique et financière pour une demande de raccordement inconnue
        Alors le gestionnaire de réseau devrait être informé que "La demande de raccordement n'existe pas"
