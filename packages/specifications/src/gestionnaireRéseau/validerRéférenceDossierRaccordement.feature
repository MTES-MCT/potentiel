# language: fr
@gestionnaire-réseau
Fonctionnalité: Valider une référence de dossier de raccordement

    Plan du Scénario: Valider/Invalider une référence de dossier de raccordement
        Etant donné un gestionnaire de réseau
            | Raison sociale       | Enedis                 |
            | Expression régulière | <Expression régulière> |
        Quand on valide la référence de dossier <Référence à valider> pour le gestionnaire de réseau "Enedis"
        Alors la référence de dossier <Référence à valider> devrait être <Résultat attendu>

        Exemples:
            | Expression régulière              | Référence à valider         | Résultat attendu |
            | [a-zA-Z]{3}                       | "ABC"                       | valide           |
            | [a-zA-Z]{3}                       | "123"                       | invalide         |
            | [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6} | "OUE-RP-2022-000034"        | valide           |
            | [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6} | "ENEDIS OUE-RP-2022-000034" | invalide         |
            | ^[^\s\t]*$                        | "Référence non transmise"   | invalide         |
            | ^[^\s\t]*$                        | "Enedis OUE-RP-2022-000033" | invalide         |
            | ^[^\s\t]*$                        | "Enedis DDD"                | invalide         |
            | ^[^\s\t]*$                        | "OUE-RP-2022-000033 "       | invalide         |
            | ^[^\s\t]*$                        | " OUE-RP-2022-000033"       | invalide         |
            | ^[^\s\t]*$                        | "OUE-RP-2022-000033"        | valide           |
            | ^[^\s\t]*$                        | "ENEDIS"                    | valide           |

    Plan du Scénario: Valider/Invalider une référence de dossier de raccordement après modification du gestionnaire de réseau
        Etant donné un gestionnaire de réseau
            | Raison sociale       | Enedis |
            | Expression régulière | (.*)   |
        Quand le DGEC validateur modifie les données d'un gestionnaire de réseau
            | Raison sociale       | Enedis                 |
            | Expression régulière | <Expression régulière> |
        Et on valide la référence de dossier <Référence à valider> pour le gestionnaire de réseau "Enedis"
        Alors la référence de dossier <Référence à valider> devrait être <Résultat attendu>

        Exemples:
            | Expression régulière              | Référence à valider         | Résultat attendu |
            | [a-zA-Z]{3}                       | "ABC"                       | valide           |
            | [a-zA-Z]{3}                       | "123"                       | invalide         |
            | [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6} | "OUE-RP-2022-000034"        | valide           |
            | [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6} | "ENEDIS OUE-RP-2022-000034" | invalide         |
            | ^[^\s\t]*$                        | "Référence non transmise"   | invalide         |
            | ^[^\s\t]*$                        | "Enedis OUE-RP-2022-000033" | invalide         |
            | ^[^\s\t]*$                        | "Enedis DDD"                | invalide         |
            | ^[^\s\t]*$                        | "OUE-RP-2022-000033 "       | invalide         |
            | ^[^\s\t]*$                        | " OUE-RP-2022-000033"       | invalide         |
            | ^[^\s\t]*$                        | "OUE-RP-2022-000033"        | valide           |
            | ^[^\s\t]*$                        | "ENEDIS"                    | valide           |
