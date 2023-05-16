#Language: fr-FR
Fonctionnalité: Modifier une proposition technique et financière

    Scénario: Un porteur de projet modifie une proposition technique et financière
    Etant donné un dossier de raccordement
        Quand le porteur modifie la proposition technique et financière avec une date de signature au "2023-04-26" et un nouveau fichier
        Alors la date de signature "2023-04-26" et le format du fichier devraient être consultables dans le dossier de raccordement
        Et le nouveau fichier devrait être enregistré et consultable pour ce dossier de raccordement

    Scénario: Impossible de modifier une date de signature pour un dossier de raccordement non connu
        Quand un administrateur modifie la date de signature pour un dossier de raccordement non connu
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 