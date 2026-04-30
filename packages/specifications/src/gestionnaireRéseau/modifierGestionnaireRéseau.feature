# language: fr
@gestionnaire-réseau
@select
Fonctionnalité: Modifier un gestionnaire de réseau

    Scénario: Modifier un gestionnaire de réseau
        Etant donné un gestionnaire de réseau
            | Code EIC       | 17X0000009352859       |
            | Raison sociale | Arc Energies Maurienne |
        Quand le DGEC validateur modifie le gestionnaire de réseau
        Alors le gestionnaire de réseau devrait être consultable

    Scénario: Impossible de modifier un gestionnaire de réseau inconnu
        Quand le DGEC validateur modifie le gestionnaire de réseau avec un gestionnaire inconnu
        Alors la dgec devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

    Scénario: Impossible de modifier un gestionnaire de réseau avec les mêmes valeurs
        Etant donné un gestionnaire de réseau
            | Code EIC       | 17X0000009352859 |
            | Raison sociale | RTE              |
        Quand le DGEC validateur modifie le gestionnaire de réseau avec les mêmes valeurs
        Alors la dgec devrait être informé que "Le gestionnaire de réseau n'a pas été modifié"
