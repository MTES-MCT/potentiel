#Language: fr-FR
Fonctionnalité: Transmettre une proposition technique et financière

    Scénario: Un porteur de projet transmet une proposition technique et financière pour une demande complète de raccordement
        Etant donné une demande complète de raccordement
        Quand le porteur de projet transmet une proposition technique et financière pour la demande complète de raccordement avec la date de signature au "2021-04-28"
        Alors une proposition technique et financière devrait être consultable dans la demande complète de raccordement avec une date de signature au au "2021-04-28"

    # Scénario: Impossible d'envoyer une proposition technique et financière pour une demande de raccordement inconnue
    #     Quand le porteur de projet transmet une proposition technique et financière pour une demande complète de raccordement inconnue
    #     Alors le porteur de projet devrait être informé que "La demande complète de raccordement n'existe pas"
