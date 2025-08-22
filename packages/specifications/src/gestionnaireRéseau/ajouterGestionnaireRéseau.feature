# language: fr
@gestionnaire-réseau
@ajouter-gestionnaire-réseau
Fonctionnalité: Ajouter un gestionnaire de réseau

    Scénario: Ajouter un gestionnaire de réseau
        Quand le DGEC validateur ajoute un gestionnaire de réseau
            | Code EIC             | 17X0000009352859       |
            | Raison sociale       | Arc Energies Maurienne |
            | Format               | XXX                    |
            | Légende              | Trois lettres          |
            | Expression régulière | [a-zA-Z]{3}            |
            | Email de contact     | arc@gmail.com          |

        Alors le gestionnaire de réseau "Arc Energies Maurienne" devrait être disponible dans le référenciel des gestionnaires de réseau
        Et les détails du gestionnaire de réseau "Arc Energies Maurienne" devraient être consultables

    Scénario: Impossible d'ajouter 2 gestionnaires de réseau avec un code EIC identique
        Etant donné un gestionnaire de réseau
            | Code EIC       | 17X100A100A0001B       |
            | Raison sociale | Arc Energies Maurienne |
        Quand le DGEC validateur ajoute un gestionnaire de réseau avec le même code EIC
            | Code EIC       | 17X100A100A0001B        |
            | Raison sociale | Un nouveau gestionnaire |
        Alors l'administrateur devrait être informé que "Le gestionnaire de réseau existe déjà"
