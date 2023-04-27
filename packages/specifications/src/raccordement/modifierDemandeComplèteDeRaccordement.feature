#Language: fr-FR
Fonctionnalité: Modifier une demande complète de raccordement

    Scénario: Un porteur de projet modifie une demande complète de raccordement
    Etant donné un dossier de raccordement
        Quand le porteur modifie la date de qualification au "2023-04-26" et une nouvelle référence "nouvelle-reference"
        Alors la date de qualification "2023-04-26" et la référence "nouvelle-reference" devraient être consultables dans le dossier de raccordement

    Scénario: Impossible de modifier la date de qualification pour un dossier de raccordement non connu
        Quand un administrateur modifie la date de qualification pour un dossier de raccordement non connu
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 