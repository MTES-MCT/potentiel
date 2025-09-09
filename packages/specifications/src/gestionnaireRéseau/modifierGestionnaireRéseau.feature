# language: fr
@gestionnaire-réseau
Fonctionnalité: Modifier un gestionnaire de réseau

    Scénario: Modifier un gestionnaire de réseau
        Etant donné un gestionnaire de réseau
            | Code EIC       | 17X0000009352859       |
            | Raison sociale | Arc Energies Maurienne |
        Quand le DGEC validateur modifie les données d'un gestionnaire de réseau
            | Code EIC             | 17X0000009352859 |
            | Raison sociale       | RTE              |
            | Légende              | Trois lettres    |
            | Format               | XXX              |
            | Expression régulière | [a-zA-Z]{3}      |
            | Email de contact     | arc@gmail.com    |
        Alors le gestionnaire de réseau "RTE" devrait être à jour dans le référenciel des gestionnaires de réseau
        Et les détails à jour du gestionnaire de réseau "RTE" devraient être consultables

    Scénario: Impossible de modifier un gestionnaire de réseau inconnu
        Quand le DGEC validateur modifie les données d'un gestionnaire de réseau inconnu
            | Code EIC       | Code EIC inconnu |
            | Raison sociale | RTE              |
        Alors l'administrateur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"
