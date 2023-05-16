#Language: fr-FR
Fonctionnalité: Modifier une demande complète de raccordement

    Scénario: Un porteur de projet modifie une demande complète de raccordement
    Etant donné un dossier de raccordement
        Quand le porteur modifie une demande complète de raccordement avec une date de qualification au "2023-04-26", une nouvelle référence "nouvelle-reference" et un nouveau fichier
        Alors la date de qualification "2023-04-26", la référence "nouvelle-reference" et le format du fichier devraient être consultables dans un nouveau dossier de raccordement
        Et l'ancien dossier de raccordement ne devrait plus être consultable
        Et l'accusé de réception devrait être enregistré et consultable pour ce dossier de raccordement pour la nouvelle référence "nouvelle-reference"
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet avec comme référence "nouvelle-reference"

    Scénario: Impossible de modifier la date de qualification pour un dossier de raccordement non connu
        Quand un administrateur modifie la date de qualification pour un dossier de raccordement non connu
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 