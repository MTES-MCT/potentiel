# language: fr
Fonctionnalité: Modifier le représentant légal d'un projet lauréat

    Scénario: Modifier le représentant légal d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le DGEC validateur modifie le nom et le type du représentant légal pour le projet lauréat
        Alors le représentant légal du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                       |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                            |

    Scénario: Modifier le représentant légal d'un projet lauréat abandonné
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges modificatif choisi
        Et un abandon accordé pour le projet lauréat
        Quand le DGEC validateur modifie le nom et le type du représentant légal pour le projet lauréat
        Alors le représentant légal du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                       |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                            |

    Scénario: Modifier le représentant légal d'un projet lauréat achevé
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges modificatif choisi
        Et une attestation de conformité transmise pour le projet lauréat
        Quand le DGEC validateur modifie le nom et le type du représentant légal pour le projet lauréat
        Alors le représentant légal du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                       |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                            |

    Scénario: Impossible de modifier le représentant légal d'un projet lauréat inexistant
        Quand le DGEC validateur modifie le nom et le type du représentant légal pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucun représentant légal n'est associé à ce projet"

    Scénario: Impossible de modifier le représentant légal avec une valeur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le DGEC validateur modifie le nom et le type du représentant légal avec les mêmes valeurs pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le représentant légal est identique à celui déjà associé au projet"

    Scénario: Impossible de modifier le représentant légal d'un projet lauréat si une demande de changement de représentant légal est en cours
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le DGEC validateur modifie le nom et le type du représentant légal pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Impossible de modifier le représentant légal car une demande de changement est déjà en cours"
