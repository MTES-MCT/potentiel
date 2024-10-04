# language: fr
Fonctionnalité: Corriger une candidature

    Contexte:
        Etant donné le DGEC validateur "Robert Robichet"
        Et la candidature lauréate "Du boulodrome de Marseille"

    Scénario: Corriger une candidature
        Quand un administrateur corrige la candidature avec :
            | nom candidat | abcd |
        Alors la candidature devrait être consultable

    Scénario: Corriger une candidature notifiée
        Quand le DGEC validateur notifie la candidature comme lauréate
        Et un administrateur corrige la candidature avec :
            | nom candidat | abcd |
        Alors la candidature devrait être consultable
        Et le porteur a été prévenu que son attestation a été modifiée

    Scénario: Impossible de changer l'AO d'une candidature
        Quand un administrateur corrige la candidature avec :
            | appel d'offre | x |
        Alors l'administrateur devrait être informé que "La candidature n'existe pas"

    Scénario: Impossible de changer la période d'une candidature
        Quand un administrateur corrige la candidature avec :
            | période | x |
        Alors l'administrateur devrait être informé que "La candidature n'existe pas"

    Scénario: Impossible de corriger une candidature avec une famille d'AO inexistante
        Quand un administrateur corrige la candidature avec :
            | famille | x |
        Alors l'administrateur devrait être informé que "La candidature n'existe pas"

    Scénario: Impossible de changer le numéro CRE d'une candidature
        Quand un administrateur corrige la candidature avec :
            | numéro CRE | x |
        Alors l'administrateur devrait être informé que "La candidature n'existe pas"

    Scénario: Impossible de corriger une candidature sans GF, pour un AO soumis aux GF
        Etant donné la candidature lauréate "Centrale PV" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
            | famille       |                 |
        Quand un administrateur corrige la candidature avec :
            | type GF |  |
        Alors l'administrateur devrait être informé que "Les garanties financières sont requises pour cet appel d'offre ou famille"

    Scénario: Impossible de corriger une candidature avec des GF "avec date d'échéance" si la date d'échéance est maquante
        Quand un administrateur corrige la candidature avec :
            | type GF | avec-date-échéance |
        Alors l'administrateur devrait être informé que "La date d'échéance des garanties financières est requise"

    Scénario: Impossible de corriger une candidature sans modifications
        Quand un administrateur corrige la candidature sans modification
        Alors l'administrateur devrait être informé que "La candidature ne contient aucune modification"
