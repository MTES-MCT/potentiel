import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../core/domain';

import { makeDemandeAnnulationAbandon } from './DemandeAnnulationAbandon';
import { AnnulationAbandonDemandée, AnnulationAbandonAnnulée } from './events';

describe(`Fabriquer l'agrégat pour une demande d'abandon`, () => {
  it(`Quand on fabrique la demande d'abandon avec un événement 'AnnulationAbandonDemandée'
      Alors la demande a un statut 'envoyée'
      Et l'identifiant du projet est récupéré`, () => {
    const demandeAbandon = makeDemandeAnnulationAbandon({
      id: new UniqueEntityID('la-demande'),
      events: [
        new AnnulationAbandonDemandée({
          payload: {
            projetId: 'le-projet-de-la-demande',
            demandeId: 'la-demande',
            demandéPar: 'le-porteur',
            cahierDesCharges: '30/08/2022',
          },
        }),
      ],
    });

    expect(demandeAbandon.isOk()).toBe(true);
    demandeAbandon.isOk() &&
      expect(demandeAbandon.value).toMatchObject({
        projetId: 'le-projet-de-la-demande',
        statut: 'envoyée',
      });
  });

  it(`Quand on fabrique la demande d'abandon avec un événement 'AnnulationAbandonAnnulée'
      Alors la demande a un statut 'annulée'`, () => {
    const demandeAbandon = makeDemandeAnnulationAbandon({
      id: new UniqueEntityID('la-demande'),
      events: [
        new AnnulationAbandonAnnulée({
          payload: {
            demandeId: 'la-demande',
            annuléePar: 'le-porteur',
          },
        }),
      ],
    });

    expect(demandeAbandon.isOk()).toBe(true);
    demandeAbandon.isOk() &&
      expect(demandeAbandon.value).toMatchObject({
        statut: 'annulée',
      });
  });
});
