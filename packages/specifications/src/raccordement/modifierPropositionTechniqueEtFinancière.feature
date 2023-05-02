#Language: fr-FR
Fonctionnalité: Modifier une proposition technique et financière

    Scénario: Un porteur de projet modifie une proposition technique et financière
    Etant donné un dossier de raccordement
        Quand le porteur modifie la date de signature de la proposition technique et financière au "2023-04-26"
        Alors la date de signature "2023-04-26" devrait être consultable dans le dossier de raccordement

    Scénario: Impossible de modifier une date de siganture pour un dossier de raccordement non connu
        Quand un administrateur modifie la date de signature pour un dossier de raccordement non connu
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 