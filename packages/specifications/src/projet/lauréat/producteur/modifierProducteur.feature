# language: fr
Fonctionnalité: Modifier le producteur d'un projet lauréat

    @NotImplemented
    Scénario: Modifier le producteur d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand l'administrateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour
        Et le porteur du projet lauréat ne devrait plus y avoir accès
        Et il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Et il ne devrait pas y avoir de garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        # TODO : Vérifier qu'on veut bien prévenir le porteur que le producteur a été modifié et qu'il a perdu ses droits sur le projet + plus de GF
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                               |

    @NotImplemented
    Scénario: Modifier le producteur d'un projet lauréat abandonné
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un abandon accordé pour le projet lauréat
        Quand l'administrateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour
        Et le porteur du projet lauréat ne devrait plus y avoir accès
        Et il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Et il ne devrait pas y avoir de garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        # TODO : Vérifier qu'on veut bien prévenir le porteur que le producteur a été modifié et qu'il a perdu ses droits sur le projet + plus de GF
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                               |

    @NotImplemented
    Scénario: Modifier le producteur d'un projet lauréat achevé
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et une attestation de conformité transmise pour le projet lauréat
        Quand l'administrateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour
        Et le porteur du projet lauréat ne devrait plus y avoir accès
        Et il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Et il ne devrait pas y avoir de garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        # TODO : Vérifier qu'on veut bien prévenir le porteur que le producteur a été modifié et qu'il a perdu ses droits sur le projet + plus de GF
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                               |

    @NotImplemented
    Scénario: Modifier le producteur d'un projet lauréat achevé dont l'appel d'offre empêche un changement avant l'achèvement du projet
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" avec :
            | appel d'offre | Eolien |
            | période       | 1      |
        Et une attestation de conformité transmise pour le projet lauréat
        Quand l'administrateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour
        Et le porteur du projet lauréat ne devrait plus y avoir accès
        Et il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Bordeaux"
        Et il ne devrait pas y avoir de garanties financières actuelles pour le projet "Du boulodrome de Bordeaux"
        # TODO : Vérifier qu'on veut bien prévenir le porteur que le producteur a été modifié et qu'il a perdu ses droits sur le projet + plus de GF
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                               |

    @NotImplemented
    Scénario: Impossible de modifier le producteur d'un projet lauréat si l'appel d'offre empêche un changement avant l'achèvement du projet
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" avec :
            | appel d'offre | Eolien |
            | période       | 1      |
        Quand l'administrateur modifie le producteur du projet lauréat
        Alors l'utilisateur devrait être informé que "L'appel d'offre du projet empêche un changement de producteur avant l'achèvement du projet"

    @NotImplemented
    Scénario: Impossible de modifier le producteur d'un projet lauréat inexistant
        Quand l'administrateur modifie le producteur du projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    @NotImplemented
    Scénario: Impossible de modifier le producteur avec une valeur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand l'administrateur modifie le producteur avec un nouveau producteur identifique pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le producteur est identique à celui déjà associé au projet"
