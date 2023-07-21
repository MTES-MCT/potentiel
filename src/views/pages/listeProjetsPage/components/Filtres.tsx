import React from 'react';

import { Request } from 'express';
import { Form, BarreDeRecherche, Label, Select, LinkButton } from '@components';
import { resetUrlParams, updateUrlParams } from '@views/helpers';
import routes from '@routes';
import { AppelOffre, Famille, Periode } from '@entities';
import { userIsNot } from '@modules/users';

export type FiltresProps = {
  appelsOffre: AppelOffre[];
  existingAppelsOffres: Array<AppelOffre['id']>;
  existingPeriodes?: Array<Periode['id']>;
  existingFamilles?: Array<Famille['id']>;
  query: {
    recherche?: string;
    appelOffreId?: string;
    periodeId?: string;
    familleId?: string;
    classement: string;
    reclames: string;
    garantiesFinancieres: string;
  };
  familles?: Famille[] | undefined;
  user: Request['user'];
};

export const Filtres = ({
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
  query: {
    recherche,
    appelOffreId,
    periodeId,
    familleId,
    garantiesFinancieres,
    classement,
    reclames,
  },
  user,
}: FiltresProps) => {
  const hasNonDefaultClassement =
    (user?.role === 'porteur-projet' && classement) ||
    (user &&
      ['admin', 'dreal', 'dgec-validateur'].includes(user?.role) &&
      classement !== 'classés');

  const hasFilters = !!(
    appelOffreId ||
    periodeId ||
    familleId ||
    garantiesFinancieres ||
    hasNonDefaultClassement
  );

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id));

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id));

  return (
    <Form action={routes.LISTE_PROJETS} method="GET" className="mb-6">
      <BarreDeRecherche
        placeholder="Rechercher par nom du projet"
        name="recherche"
        defaultValue={recherche || ''}
        className="mt-8"
      />

      <div>
        <Label htmlFor="appelOffreId">Appel d'offre concerné</Label>
        <Select
          id="appelOffreId"
          name="appelOffreId"
          defaultValue={appelOffreId || 'default'}
          onChange={(event) =>
            updateUrlParams({
              appelOffreId: event.target.value,
              periodeId: null,
              familleId: null,
            })
          }
        >
          <option value="default" disabled hidden>
            Choisir un appel d‘offre
          </option>
          <option value="">Tous appels d'offres</option>
          {appelsOffre
            .filter((appelOffre) => existingAppelsOffres.includes(appelOffre.id))
            .map((appelOffre) => (
              <option key={`appel_${appelOffre.id}`} value={appelOffre.id}>
                {appelOffre.shortTitle}
              </option>
            ))}
        </Select>
      </div>
      {appelOffreId && periodes && periodes.length > 0 && (
        <div>
          <Label htmlFor="periodeId" className="mt-4">
            Période concernée
          </Label>
          <Select
            id="periodeId"
            name="periodeId"
            defaultValue={periodeId}
            onChange={(event) =>
              updateUrlParams({
                periodeId: event.target.value,
              })
            }
          >
            <option value="default" disabled hidden>
              Choisir une période
            </option>
            <option value="">Toutes périodes</option>
            {periodes.map((periode) => (
              <option key={`appel_${periode.id}`} value={periode.id}>
                {periode.title}
              </option>
            ))}
          </Select>
        </div>
      )}
      {appelOffreId && familles && familles.length > 0 && (
        <div>
          <Label htmlFor="familleId" className="mt-4">
            Famille concernée
          </Label>
          <Select
            id="familleId"
            name="familleId"
            defaultValue={familleId || 'default'}
            onChange={(event) =>
              updateUrlParams({
                familleId: event.target.value,
              })
            }
          >
            <option value="default" disabled hidden>
              Choisir une famille
            </option>
            <option value="">Toutes familles</option>
            {familles.map((famille) => (
              <option key={`appel_${famille.id}`} value={famille.id}>
                {famille.title}
              </option>
            ))}
          </Select>
        </div>
      )}
      {['admin', 'dreal', 'dgec-validateur', 'porteur-projet', 'caisse-des-dépôts'].includes(
        user.role,
      ) && (
        <div>
          <Label htmlFor="garantiesFinancieres" className="mt-4">
            Garanties financières
          </Label>
          <Select
            id="garantiesFinancieres"
            name="garantiesFinancieres"
            defaultValue={garantiesFinancieres || 'default'}
            onChange={(event) =>
              updateUrlParams({
                garantiesFinancieres: event.target.value,
              })
            }
          >
            <option value="default" disabled hidden>
              Choisir un état
            </option>
            <option value="">Toutes</option>
            <option value="submitted">Déposées</option>
            <option value="notSubmitted">Non-déposées</option>
            <option value="pastDue">En retard</option>
          </Select>
        </div>
      )}
      <div className="flex-1 flex-shrink-0">
        <Label htmlFor="classement">Projets Classés/Eliminés/Abandons</Label>
        <Select
          id="classement"
          name="classement"
          defaultValue={classement || 'default'}
          onChange={(event) =>
            updateUrlParams({
              classement: event.target.value,
            })
          }
        >
          <option value="default" disabled hidden>
            Choisir un état
          </option>
          <option value="">Tous</option>
          <option value="classés">Classés</option>
          <option value="éliminés">Eliminés</option>
          <option value="abandons">Abandons</option>
        </Select>
      </div>
      {userIsNot('porteur-projet')(user) && (
        <div className="flex-1 flex-shrink-0 mt-4 md:mt-0">
          <Label htmlFor="reclames">Projets Réclamés/Non réclamés</Label>
          <Select
            id="reclames"
            name="reclames"
            defaultValue={reclames || 'default'}
            onChange={(event) =>
              updateUrlParams({
                reclames: event.target.value,
              })
            }
          >
            <option value="default" disabled hidden>
              Choisir un état
            </option>
            <option value="">Tous</option>
            <option value="réclamés">Réclamés</option>
            <option value="non-réclamés">Non réclamés</option>
          </Select>
        </div>
      )}
      {hasFilters && (
        <LinkButton href="#" onClick={resetUrlParams}>
          Retirer tous les filtres
        </LinkButton>
      )}
    </Form>
  );
};
