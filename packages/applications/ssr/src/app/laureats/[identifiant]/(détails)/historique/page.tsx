import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import { getLauréatInfos } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { categoriesDisponibles, mapCatégorieToLabel } from './_helpers/catégories';
import { getHistoriqueTrié } from './_helpers/getHistoriqueTrié';
import { type HistoriqueLauréatAction, HistoriqueLauréatPage } from './HistoriqueLauréat.page';

type PageProps = IdentifiantParameter & {
  searchParams?: Promise<Record<string, string>>;
};

export const metadata: Metadata = { title: 'Historique' };

const paramsSchema = z.object({
  categorie: z.enum(categoriesDisponibles).optional(),
});

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);
      const { categorie } = paramsSchema.parse(searchParams);

      const lauréat = await getLauréatInfos(
        IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      );

      const historique = await mediator.send<Lauréat.ListerHistoriqueProjetQuery>({
        type: 'Lauréat.Query.ListerHistoriqueProjet',
        data: {
          identifiantProjet,
          category: categorie,
        },
      });

      const historiqueTrié = getHistoriqueTrié({
        items: historique.items,
        unitéPuissance: lauréat.unitéPuissance.formatter(),
        attestationDésignation: lauréat.attestationDésignation,
      });

      const catégories = categoriesDisponibles
        .map((categorie) => ({
          label: mapCatégorieToLabel(categorie),
          value: categorie,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'fr'));

      return (
        <HistoriqueLauréatPage
          identifiantProjet={identifiantProjet}
          actions={mapToActions(utilisateur.rôle)}
          catégories={catégories}
          historique={historiqueTrié}
        />
      );
    }),
  );
}

const mapToActions = (rôle: Role.ValueType) => {
  const actions: Array<HistoriqueLauréatAction> = [];

  if (rôle.aLaPermission('historique.imprimer')) {
    actions.push('imprimer');
  }

  return actions;
};
