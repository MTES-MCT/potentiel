#language: fr-FR
Fonctionnalité: Accepter une proposition technique et financière

    Scénario: Un porteur de projet accepte une proposition technique et financière
        Etant donné une proposition technique et financière
        Quand le porteur de projet accepte la proposition technique et financière
        Alors la proposition technique et financière devrait être acceptée dans la demande de raccordement

    Scénario: Impossible d'accepter une proposition technique et financière inconnue
        Quand le porteur de projet accepte la proposition technique et financière inconnue
        Alors le porteur de projet devrait être informé que "La proposition technique et financière n'existe pas"
