# language: fr
@installateur
@installation
Fonctionnalité: Modifier l'installateur d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | installateur   | Installateur.Inc         |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Modifier l'installateur d'un projet lauréat en tant qu'admin
        Quand le DGEC validateur modifie l'installateur du projet lauréat
        Alors l'installateur du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | nom_projet | Du boulodrome de Marseille                            |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html |

        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de l'installateur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                   |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                        |

    Scénario: Modifier l'installateur d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le DGEC validateur modifie l'installateur du projet lauréat
        Alors l'installateur du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de l'installateur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                   |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                        |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de l'installateur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                   |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                        |

    Scénario: Modifier l'installateur d'un projet lauréat achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le DGEC validateur modifie l'installateur du projet lauréat
        Alors l'installateur du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de l'installateur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                   |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                        |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de l'installateur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                   |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                        |

    Scénario: Impossible de modifier l'installateur avec une valeur identique
        Quand le DGEC validateur modifie l'installateur avec une valeur identique pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le nouvel installateur est identique à celui associé au projet"

    Scénario: Impossible de modifier l'installateur si le champ n'est pas disponible dans l'appel d'offres du projet
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 11              |
        Quand le DGEC validateur modifie l'installateur du projet lauréat
        Alors l'utilisateur devrait être informé que "L'installateur ne peut être renseigné pour cet appel d'offres"
