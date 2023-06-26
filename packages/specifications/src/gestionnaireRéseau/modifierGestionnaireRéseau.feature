#Language: fr-FR
Fonctionnalité: Modifier un gestionnaire de réseau

    Scénario: Modifier un gestionnaire de réseau
        Etant donné un gestionnaire de réseau
            | Code EIC       | 17X0000009352859       |
            | Raison sociale | Arc Energies Maurienne |
        Quand un administrateur modifie les données d'un gestionnaire de réseau
            | Code EIC       | 17X0000009352859 |
            | Raison sociale | RTE              |
            | Légende        | Trois lettres    |
            | Format         | XXX              |
        Alors le gestionnaire de réseau "RTE" devrait être à jour dans le référenciel des gestionnaires de réseau
        Et les détails à jour du gestionnaire de réseau "RTE" devraient être consultables

    Scénario: Modifier la règle de saisie de référence de dossier d'un gestionnaire de réseau
        Etant donné un gestionnaire de réseau
            | Code EIC             | 17X0000009352859       |
            | Raison sociale       | Arc Energies Maurienne |
            | Expression régulière | (.*)                   |
        Quand un administrateur modifie les données d'un gestionnaire de réseau
            | Code EIC             | 17X0000009352859       |
            | Raison sociale       | Arc Energies Maurienne |
            | Expression régulière | [a-zA-Z]{3}            |
        Alors pour le gestionnaire de réseau "Arc Energies Maurienne" la référence de dossier "ABC" devrait être valide
        Mais pour le gestionnaire de réseau "Arc Energies Maurienne" la référence de dossier "123" devrait être invalide

    Scénario: Impossible de modifier un gestionnaire de réseau inconnu
        Quand un administrateur modifie les données d'un gestionnaire de réseau inconnu
            | Code EIC       | Code EIC inconnu |
            | Raison sociale | RTE              |
        Alors l'administrateur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"
