// import { mediator } from 'mediateur';
// import { cache } from 'react';

import { mediator } from 'mediateur';
import { cache } from 'react';

import { DateTime } from '@potentiel-domain/common';
import type { Lauréat, ListerDemandesEnInstructionQuery, Éliminé } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

type GetDemandesProps = {
  utilisateur: string;
  rôle: 'dreal' | 'dgec';
};

export const getNombreDemandesEnInstruction = cache(
  async ({ utilisateur, rôle }: GetDemandesProps) => {
    const rôleValueType = Role.convertirEnValueType(rôle);

    const ilYAUnMois = DateTime.now().retirerNombreDeMois(1);

    const t0 = performance.now();
    const [abandon, actionnaire, représentantLégal, puissance, délai, recours] = await Promise.all([
      mediator.send<Lauréat.Abandon.ListerDemandesAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ListerDemandesAbandon',
        data: {
          utilisateur,
          statut: ['confirmé', 'demandé', 'en-instruction'],
          autoritéCompétente: rôle,
        },
      }),
      mediator.send<Lauréat.Actionnaire.ListerChangementActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ListerChangementActionnaire',
        data: {
          utilisateur,
          statut: ['demandé'],
        },
      }),
      mediator.send<Lauréat.ReprésentantLégal.ListerChangementReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal',
        data: {
          utilisateur,
          statut: ['demandé'],
        },
      }),
      mediator.send<Lauréat.Puissance.ListerChangementPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ListerChangementPuissance',
        data: {
          utilisateur,
          statut: ['demandé'],
        },
      }),
      mediator.send<Lauréat.Délai.ListerDemandeDélaiQuery>({
        type: 'Lauréat.Délai.Query.ListerDemandeDélai',
        data: {
          utilisateur,
          statuts: ['demandé', 'en-instruction'],
          autoritéCompétente: rôle,
        },
      }),
      rôleValueType.aLaPermission('recours.accorder')
        ? mediator.send<Éliminé.Recours.ListerDemandeRecoursQuery>({
            type: 'Éliminé.Recours.Query.ListerDemandeRecours',
            data: {
              utilisateur,
              statut: ['demandé', 'en-instruction'],
            },
          })
        : undefined,
    ]);
    const t1 = performance.now();

    const test = await mediator.send<ListerDemandesEnInstructionQuery>({
      type: 'Projet.Query.ListerDemandesEnInstruction',
      data: {
        utilisateur,
        autoritéCompétente: rôle,
      },
    });

    const t2 = performance.now();

    console.log(`get demandes sans optimisation: ${t1 - t0} ms`);
    console.log(`get demandes dans une query unique: ${t2 - t1} ms`);

    console.log(test);

    const demandesMapping = [
      ['abandon', abandon],
      ['actionnaire', actionnaire],
      ['représentantLégal', représentantLégal],
      ['puissance', puissance],
      ['délai', délai],
      ['recours', recours],
    ] as const;

    return demandesMapping
      .filter(([_, résultat]) => !!résultat)
      .map(([domain, résultat]) => ({
        domain,
        // biome-ignore lint/style/noNonNullAssertion: filter au dessus
        total: résultat!.total,
        // biome-ignore lint/style/noNonNullAssertion: filter au dessus
        new: résultat!.items.filter((d) => d.demandéLe.estUltérieureÀ(ilYAUnMois)).length,
      }));
  },
);
