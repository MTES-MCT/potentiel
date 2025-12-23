# language: fr
@candidature
Fonctionnalité: Corriger une candidature (garanties financières)

    Scénario: Impossible de corriger une candidature sans GF, pour un AO soumis aux GF
        Etant donné la candidature lauréate "Centrale PV" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
            | famille        |                 |
        Quand le DGEC validateur corrige la candidature avec :
            | type GF |  |
        Alors l'administrateur devrait être informé que "Les garanties financières sont requises pour cet appel d'offres ou famille"

    Scénario: Impossible de corriger une candidature classée avec des GF "avec date d'échéance" si la date d'échéance est manquante
        Quand le DGEC validateur corrige la candidature avec :
            | type GF | avec-date-échéance |
        Alors l'administrateur devrait être informé que "La date d'échéance des garanties financières est requise"

    Scénario: Impossible de corriger une candidature classée avec une date d'échéance pour un type de GF qui n'en attend pas
        Quand le DGEC validateur corrige la candidature avec :
            | type GF         | six-mois-après-achèvement |
            | date d'échéance | 2024-01-01                |
        Alors l'administrateur devrait être informé que "La date d'échéance ne peut être renseignée pour ce type de garanties financières"

    Scénario: Impossible de changer le type de GF d'une candidature lauréate notifiée
        Etant donné le projet lauréat "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | type GF | six-mois-après-achèvement |
        Alors l'administrateur devrait être informé que "Le type de garanties financières d'une candidature ne peut être modifié après la notification"

    Scénario: Impossible de corriger une candidature avec un type de garanties financières non disponible dans l'appel d'offres
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | statut         | classé          |
            | appel d'offres | PPE2 - Bâtiment |
        Quand le DGEC validateur corrige la candidature avec :
            | type GF | exemption |
        Alors l'administrateur devrait être informé que "Ce type de garanties financières n'est pas disponible pour cet appel d'offres"
