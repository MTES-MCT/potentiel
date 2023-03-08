import { Project } from '@infra/sequelize/projectionsNext';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { exporterProjets } from './exporterProjets';
import { resetDatabase } from '@dataAccess';

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
  notes,
  prix,
  évaluationCarbone,
} from './colonnesParCatégorie';
import { User } from '@entities';

describe(`Export des projets en tant qu'utilisateur "acheteur-obligé"`, () => {
  beforeEach(resetDatabase);

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
    ...notes,
    ...modificationsAvantImport,
    ...garantiesFinancières,
  ].map((c) => (c.source === 'propriété-colonne-détail' ? c.nomPropriété : c.intitulé));

  it(`Étant donné des projets notifiés et non notifiés,
    lorsqu'un utilisateur ayant le rôle "acheteur-obligé" exporte tous les projets,
    alors seuls les projets notifiés devrait être récupérés, 
    avec la liste des intitulés des colonnes exportées`, async () => {
    await Project.bulkCreate([
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Projet Eolien',
      }),
      makeFakeProject({
        notifiedOn: 0,
        nomProjet: 'Projet Non notifié Photovoltaïque',
      }),
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Autre',
      }),
    ]);

    const exportProjets = (
      await exporterProjets({ user: { id: 'id-user', role: 'acheteur-obligé' } as User })
    )._unsafeUnwrap();

    expect(exportProjets.colonnes).toEqual(colonnesÀExporter);

    expect(exportProjets.données).toHaveLength(2);
    expect(exportProjets.données).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          'Nom projet': 'Projet Eolien',
        }),
        expect.objectContaining({
          'Nom projet': 'Autre',
        }),
      ]),
    );
    expect(exportProjets.données).not.toContainEqual(
      expect.objectContaining({
        'Nom projet': 'Projet Non notifié Photovoltaïque',
      }),
    );
  });
});
