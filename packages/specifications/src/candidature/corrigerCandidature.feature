# language: fr
Fonctionnalité: Corriger une candidature

    Contexte:
        Etant donné le DGEC validateur "Robert Robichet"
        Et la candidature lauréate "Du boulodrome de Marseille"

    Scénario: Corriger une candidature sans régénérer l'attestation
        Quand un administrateur corrige la candidature avec :
            | nom candidat | abcd |
        Alors la candidature devrait être consultable
        Et le porteur n'a pas été prévenu que son attestation a été modifiée

    Scénario: Corriger une candidature notifiée en regénérant l'attestation
        Etant donné la candidature lauréate notifiée "Du boulodrome de Marseille #2"
        Quand un administrateur corrige la candidature avec :
            | nom candidat               | abcd |
            | doit régénérer attestation | oui  |
        Alors la candidature devrait être consultable
        Et le porteur a été prévenu que son attestation a été modifiée

    Scénario: Corriger une candidature notifiée sans régénérer l'attestation
        Etant donné la candidature lauréate notifiée "Du boulodrome de Marseille #2"
        Quand un administrateur corrige la candidature avec :
            | nom candidat               | abcd |
            | doit régénérer attestation | non  |
        Alors la candidature devrait être consultable
        Et le porteur n'a pas été prévenu que son attestation a été modifiée

    Scénario: Corriger une candidature et ses détails (typiquement, par CSV)
        Quand un administrateur corrige la candidature avec :
            | nom candidat | abcd                  |
            | détails      | {"Note carbone": "1"} |
        Alors la candidature devrait être consultable

    Scénario: Impossible de régénérer l'attestation d'une candidature non notifiée
        Quand un administrateur corrige la candidature avec :
            | nom candidat               | abcd |
            | doit régénérer attestation | oui  |
        Alors l'administrateur devrait être informé que "L'attestation d'une candidature non notifiée ne peut pas être régénérée"

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

    Scénario: Impossible de changer le statut d'une candidature lauréate notifiée en éliminée
        Etant donné la candidature lauréate notifiée "Boulodrome Sainte Livrade"
        Quand un administrateur corrige la candidature avec :
            | statut | éliminé |
        Alors l'administrateur devrait être informé que "Le statut d'une candidature ne peut être modifié après la notification"

    Scénario: Impossible de changer le statut d'une candidature éliminée notifiée en lauréate
        Etant donné la candidature éliminée notifiée "Boulodrome Sainte Livrade"
        Quand un administrateur corrige la candidature avec :
            | statut | classé |
        Alors l'administrateur devrait être informé que "Le statut d'une candidature ne peut être modifié après la notification"
