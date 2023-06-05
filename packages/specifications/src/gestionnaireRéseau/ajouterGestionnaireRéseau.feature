#Language: fr-FR
Fonctionnalité: Ajouter un gestionnaire de réseau

    Scénario: Un administrateur ajoute un gestionnaire de réseau
        Quand un administrateur ajoute un gestionnaire de réseau
            | Code EIC             | 17X0000009352859                    |
            | Raison sociale       | Arc Energies Maurienne              |
            | Format               | XXX                                 |
            | Légende              | Trois lettres                       |
            | Expression régulière | [a-zA-Z]{3}                         |
        Alors le gestionnaire de réseau devrait être disponible dans le référenciel des gestionnaires de réseau
        Et l'administrateur devrait pouvoir consulter les détails du gestionnaire de réseau

    Scénario: Un administrateur ajoute un gestionnaire de réseau déjà existant
        Etant donné un gestionnaire de réseau ayant pour code EIC "17X100A100A0001B"
        Quand un administrateur ajoute un gestionnaire de réseau ayant le même code EIC
        Alors l'administrateur devrait être informé que "Le gestionnaire de réseau existe déjà"
