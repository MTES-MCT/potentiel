# language: fr
@accès
Fonctionnalité: Remplacer l'accès d'un porteur sur un projet

    @select
    Plan du scénario: Remplacer l'accès d'un porteur
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand un administrateur remplace le porteur sur le projet lauréat
        Alors le porteur a accès au projet lauréat
        Et la liste des porteurs du projet lauréat est mise à jour
