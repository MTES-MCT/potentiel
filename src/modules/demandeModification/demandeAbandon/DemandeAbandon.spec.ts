import { UniqueEntityID } from '@core/domain'

import { makeDemandeAbandon } from './DemandeAbandon'
import {
  AbandonAccordé,
  AbandonAnnulé,
  AbandonConfirmé,
  AbandonDemandé,
  AbandonRejeté,
  ConfirmationAbandonDemandée,
  RejetAbandonAnnulé,
} from './events'

describe(`Fabriquer l'agrégat pour une demande d'abandon`, () => {
  it(`Quand on fabrique la demande d'abandon avec un événement 'AbandonDemandé'
      Alors la demande a un statut 'envoyée'
      Et l'identifiant du projet est récupéré`, () => {
    const demandeAbandon = makeDemandeAbandon({
      id: new UniqueEntityID('la-demande'),
      events: [
        new AbandonDemandé({
          payload: {
            projetId: 'le-projet-de-la-demande',
            demandeAbandonId: 'la-demande',
            autorité: 'dgec',
            porteurId: 'le-porteur',
          },
        }),
      ],
    })

    expect(demandeAbandon.isOk()).toBe(true)
    demandeAbandon.isOk() &&
      expect(demandeAbandon.value).toMatchObject({
        projetId: 'le-projet-de-la-demande',
        statut: 'envoyée',
      })
  })

  it(`Quand on fabrique la demande d'abandon avec un événement 'AbandonAccordé'
      Alors la demande a un statut 'accordée'`, () => {
    const demandeAbandon = makeDemandeAbandon({
      id: new UniqueEntityID('la-demande'),
      events: [
        new AbandonAccordé({
          payload: {
            demandeAbandonId: 'la-demande',
            projetId: 'le-projet-de-la-demande',
            accordéPar: 'accordéPar-id',
          },
        }),
      ],
    })

    expect(demandeAbandon.isOk()).toBe(true)
    demandeAbandon.isOk() &&
      expect(demandeAbandon.value).toMatchObject({
        statut: 'accordée',
      })
  })

  it(`Quand on fabrique la demande d'abandon avec un événement 'AbandonRejeté'
      Alors la demande a un statut 'rejetée'`, () => {
    const demandeAbandon = makeDemandeAbandon({
      id: new UniqueEntityID('la-demande'),
      events: [
        new AbandonRejeté({
          payload: {
            demandeAbandonId: 'la-demande',
            rejetéPar: 'rejetéPar-id',
            projetId: 'le-projet-de-la-demande',
          },
        }),
      ],
    })

    expect(demandeAbandon.isOk()).toBe(true)
    demandeAbandon.isOk() &&
      expect(demandeAbandon.value).toMatchObject({
        statut: 'refusée',
      })
  })

  it(`Quand on fabrique la demande d'abandon avec un événement 'AbandonRejeté'
      Alors la demande a un statut 'rejetée'`, () => {
    const demandeAbandon = makeDemandeAbandon({
      id: new UniqueEntityID('la-demande'),
      events: [
        new AbandonRejeté({
          payload: {
            demandeAbandonId: 'la-demande',
            rejetéPar: 'rejetéPar-id',
            projetId: 'le-projet-de-la-demande',
          },
        }),
      ],
    })

    expect(demandeAbandon.isOk()).toBe(true)
    demandeAbandon.isOk() &&
      expect(demandeAbandon.value).toMatchObject({
        statut: 'refusée',
      })
  })

  it(`Quand on fabrique la demande d'abandon avec un événement 'AbandonAnnulé'
      Alors la demande a un statut 'annulée'`, () => {
    const demandeAbandon = makeDemandeAbandon({
      id: new UniqueEntityID('la-demande'),
      events: [
        new AbandonAnnulé({
          payload: {
            demandeAbandonId: 'la-demande',
            annuléPar: 'annu léPar-id',
            projetId: 'le-projet-de-la-demande',
          },
        }),
      ],
    })

    expect(demandeAbandon.isOk()).toBe(true)
    demandeAbandon.isOk() &&
      expect(demandeAbandon.value).toMatchObject({
        statut: 'annulée',
      })
  })

  it(`Quand on fabrique la demande d'abandon avec un événement 'AbandonConfirmé'
      Alors la demande a un statut 'annulée'`, () => {
    const demandeAbandon = makeDemandeAbandon({
      id: new UniqueEntityID('la-demande'),
      events: [
        new AbandonConfirmé({
          payload: {
            demandeAbandonId: 'la-demande',
            confirméPar: 'confirméPar-id',
            projetId: 'le-projet-de-la-demande',
          },
        }),
      ],
    })

    expect(demandeAbandon.isOk()).toBe(true)
    demandeAbandon.isOk() &&
      expect(demandeAbandon.value).toMatchObject({
        statut: 'demande confirmée',
      })
  })

  it(`Quand on fabrique la demande d'abandon avec un événement 'ConfirmationAbandonDemandée'
      Alors la demande a un statut 'annulée'`, () => {
    const demandeAbandon = makeDemandeAbandon({
      id: new UniqueEntityID('la-demande'),
      events: [
        new ConfirmationAbandonDemandée({
          payload: {
            demandeAbandonId: 'la-demande',
            demandéePar: 'demandéePar-id',
            projetId: 'le-projet-de-la-demande',
          },
        }),
      ],
    })

    expect(demandeAbandon.isOk()).toBe(true)
    demandeAbandon.isOk() &&
      expect(demandeAbandon.value).toMatchObject({
        statut: 'en attente de confirmation',
      })
  })

  it(`Quand on fabrique la demande d'abandon avec un événement 'RejetAbandonAnnulé'
      Alors la demande a un statut 'annulée'`, () => {
    const demandeAbandon = makeDemandeAbandon({
      id: new UniqueEntityID('la-demande'),
      events: [
        new RejetAbandonAnnulé({
          payload: {
            demandeAbandonId: 'la-demande',
            annuléPar: 'annuléPar-id',
            projetId: 'le-projet-de-la-demande',
          },
        }),
      ],
    })

    expect(demandeAbandon.isOk()).toBe(true)
    demandeAbandon.isOk() &&
      expect(demandeAbandon.value).toMatchObject({
        statut: 'envoyée',
      })
  })
})
