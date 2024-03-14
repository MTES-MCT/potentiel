import { beforeEach, describe, expect, it } from '@jest/globals';
import { Project, UserDreal } from '../../../projectionsNext';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { exporterProjets } from './exporterProjets';

import {
  coordonnéesCandidat,
  coordonnéesGéodésiques,
  donnéesAutoconsommation,
  donnéesDeRaccordement,
  donnéesFournisseurs,
  financementCitoyen,
  garantiesFinancières,
  identificationProjet,
  implantation,
  localisationProjet,
  modificationsAvantImport,
  prix,
  référencesCandidature,
  résultatInstructionSensible,
  évaluationCarbone,
} from './colonnesParCatégorie';
import { User } from '../../../../../entities';
import { UniqueEntityID } from '../../../../../core/domain';
import { resetDatabase } from '../../../helpers';

describe(`Export des projets en tant qu'utilisateur "DREAL"`, () => {
  const colonnesÀExporter = [
    ...identificationProjet,
    ...coordonnéesCandidat,
    ...financementCitoyen,
    ...localisationProjet,
    ...coordonnéesGéodésiques,
    ...donnéesAutoconsommation,
    ...donnéesDeRaccordement,
    ...donnéesFournisseurs,
    ...évaluationCarbone,
    ...implantation,
    ...prix,
    ...référencesCandidature,
    ...résultatInstructionSensible,
    ...modificationsAvantImport,
    ...garantiesFinancières,
  ].map((c) => (c.source === 'propriété-colonne-détail' ? c.nomPropriété : c.intitulé));

  const utilisateurId = new UniqueEntityID().toString();

  beforeEach(async () => {
    await resetDatabase();
    await UserDreal.create({ id: 1, userId: utilisateurId, dreal: 'Auvergne-Rhône-Alpes' });
  });

  it(`Étant donné des projets notifiés et non notifiés,
      lorsqu'un utilisateur DREAL exporte tous les projets,
      alors seuls les projets notifiés devraient être retournés.`, async () => {
    await Project.bulkCreate([
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Projet Eolien notifié',
        regionProjet: 'Auvergne-Rhône-Alpes',
      }),
      makeFakeProject({
        notifiedOn: 0,
        nomProjet: 'Projet Non notifié Photovoltaïque',
        regionProjet: 'Auvergne-Rhône-Alpes',
      }),
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Autre projet notifié',
        regionProjet: 'Auvergne-Rhône-Alpes',
      }),
    ]);

    const exportProjets = (
      await exporterProjets({ user: { id: utilisateurId, role: 'dreal' } as User })
    )._unsafeUnwrap();

    expect(exportProjets.colonnes).toEqual(colonnesÀExporter);

    expect(exportProjets.données).toHaveLength(2);
    expect(exportProjets.données).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          'Nom projet': 'Projet Eolien notifié',
        }),
        expect.objectContaining({
          'Nom projet': 'Autre projet notifié',
        }),
      ]),
    );

    expect(exportProjets.données).not.toContainEqual(
      expect.objectContaining({
        'Nom projet': 'Projet Non notifié Photovoltaïque',
      }),
    );
  });

  it(`Étant donné des projets notifiés issus de différentes régions,
      lorsqu'un utilisateur DREAL exporte tous les projets,
      alors seuls les projets de sa région devraient être retournés`, async () => {
    await Project.bulkCreate([
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Projet Eolien de la Dreal',
        regionProjet: 'Auvergne-Rhône-Alpes',
      }),
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Projet Photovoltaïque de la Dreal',
        regionProjet: 'Auvergne-Rhône-Alpes',
      }),
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Projet autre région',
        regionProjet: 'Normandie',
      }),
    ]);

    const exportProjets = (
      await exporterProjets({ user: { id: utilisateurId, role: 'dreal' } as User })
    )._unsafeUnwrap();

    expect(exportProjets.colonnes).toEqual(colonnesÀExporter);

    expect(exportProjets.données).toHaveLength(2);
    expect(exportProjets.données).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          'Nom projet': 'Projet Eolien de la Dreal',
        }),
        expect.objectContaining({
          'Nom projet': 'Projet Photovoltaïque de la Dreal',
        }),
      ]),
    );

    expect(exportProjets.données).not.toContainEqual(
      expect.objectContaining({
        'Nom projet': 'Projet autre région',
      }),
    );
  });
});
