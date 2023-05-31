#Language: fr-FR
Fonctionnalité: Modifier une proposition technique et financière

    Scénario: Un porteur de projet modifie une proposition technique et financière
    Etant donné un dossier de raccordement avec une proposition technique et financière
        Quand le porteur modifie la proposition technique et financière
        Alors la proposition technique et financière signée devrait être consultable dans le dossier de raccordement

    Scénario: Impossible de modifier une date de signature pour un dossier de raccordement non connu
        Etant donné un dossier de raccordement avec une proposition technique et financière
        Quand un administrateur modifie la date de signature pour un dossier de raccordement non connu
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 