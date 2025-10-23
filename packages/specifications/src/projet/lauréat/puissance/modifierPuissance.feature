# language: fr
@puissance
@select
Fonctionnalité: Modifier la puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Modifier la puissance d'un projet lauréat par un admin
        Quand le DGEC validateur modifie la puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de la puissance du projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                            |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                 |

    Scénario: Modifier la puissance et la puissance de site d'un projet lauréat par un admin
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Et la dreal "Dreal du sud" associée à la région du projet
        Quand le DGEC validateur modifie la puissance pour le projet lauréat avec :
            | ratio puissance de site | 2 |
        Alors la puissance du projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de la puissance du projet Du bouchon lyonnais dans le département(.*) |
            | nom_projet | Du bouchon lyonnais                                                                            |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                          |

    Scénario: Modifier uniquement la puissance de site d'un projet lauréat par un admin
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Et la dreal "Dreal du sud" associée à la région du projet
        Quand le DGEC validateur modifie la puissance pour le projet lauréat avec :
            | ratio puissance de site | 2 |
            | ratio puissance         |   |
        Alors la puissance du projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de la puissance du projet Du bouchon lyonnais dans le département(.*) |
            | nom_projet | Du bouchon lyonnais                                                                            |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                          |

    Scénario: Modifier la puissance d'un projet lauréat abandonné par un admin
        Etant donné un abandon accordé pour le projet lauréat
        Quand le DGEC validateur modifie la puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de la puissance du projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                            |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                 |

    Scénario: Modifier la puissance d'un projet lauréat achevé par un admin
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le DGEC validateur modifie la puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de la puissance du projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                            |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                 |

    Scénario: Impossible de modifier la puissance avec une valeur identique
        Quand le DGEC validateur modifie la puissance avec la même valeur pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La puissance doit avoir une valeur différente"

    Scénario: Impossible de modifier la puissance si la nouvelle valeur est nulle ou négative
        Quand le DGEC validateur modifie la puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors l'utilisateur devrait être informé que "La puissance d'un projet doit avoir une valeur positive"

        Exemples:
            | Ratio |
            | 0     |
            | -1    |

    Scénario: Impossible de modifier la puissance de site si la nouvelle valeur est nulle ou négative
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Quand le DGEC validateur modifie la puissance pour le projet lauréat avec :
            | ratio puissance de site | <Ratio> |
        Alors l'utilisateur devrait être informé que "La puissance de site d'un projet doit avoir une valeur positive"

        Exemples:
            | Ratio |
            | 0     |
            | -1    |

    Scénario: Impossible de modifier uniquement la puissance, et pas la puissance de site, pour un AO qui requiert ce champs
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Quand le DGEC validateur modifie la puissance pour le projet lauréat avec :
            | ratio puissance         | 1,2 |
            | ratio puissance de site |     |

        Alors l'utilisateur devrait être informé que "La puissance de site d'un projet doit avoir une valeur positive"

    Scénario: Impossible de modifier la puissance d'un projet lauréat alors qu'un changement de puissance est en cours
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du presque-sud" associée à la région du projet
        Et une demande de changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Quand le DGEC validateur modifie la puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de changement de puissance est déjà en cours"
