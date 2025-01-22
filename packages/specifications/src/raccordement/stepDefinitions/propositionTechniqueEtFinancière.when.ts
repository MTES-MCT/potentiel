import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/reseau';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

Quand(
  `le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await transmettrePropositionTechniqueEtFinancière.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
    );
  },
);

Quand(
  `le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet éliminé`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.eliminéWorld;
    const { référenceDossier } = this.raccordementWorld;

    await transmettrePropositionTechniqueEtFinancière.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
    );
  },
);

Quand(
  `le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat avec :`,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await transmettrePropositionTechniqueEtFinancière.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      datatable.rowsHash(),
    );
  },
);

Quand(
  `le porteur modifie la proposition technique et financière pour le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await modifierPropositionTechniqueEtFinancière.call(this, identifiantProjet, référenceDossier);
  },
);

Quand(
  `le porteur modifie la proposition technique et financière pour le dossier de raccordement du projet lauréat avec :`,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await modifierPropositionTechniqueEtFinancière.call(
      this,
      identifiantProjet,
      référenceDossier,
      datatable.rowsHash(),
    );
  },
);

async function transmettrePropositionTechniqueEtFinancière(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  data: Record<string, string> = {},
) {
  const { dateSignature, propositionTechniqueEtFinancièreSignée, référenceDossier } =
    this.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...this.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
      data: {
        dateSignatureValue: dateSignature,
        référenceDossierRaccordementValue: référenceDossier,
        identifiantProjetValue: identifiantProjet,
        propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}

async function modifierPropositionTechniqueEtFinancière(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  référence: string,
  data: Record<string, string> = {},
) {
  const { dateSignature, propositionTechniqueEtFinancièreSignée, référenceDossier } =
    this.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier: référence,
      ...this.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
      data: {
        dateSignatureValue: dateSignature,
        référenceDossierRaccordementValue: référenceDossier,
        identifiantProjetValue: identifiantProjet.formatter(),
        propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
