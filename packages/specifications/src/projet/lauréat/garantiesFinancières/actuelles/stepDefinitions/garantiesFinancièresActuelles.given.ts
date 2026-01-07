import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { PotentielWorld } from '../../../../../potentiel.world';
import { EnregistrerGarantiesFinancièresProps } from '../fixtures/enregistrerGarantiesFinancières.fixture';
import { convertFixtureFileToReadableStream } from '../../../../../helpers/convertFixtureFileToReadable';

EtantDonné(
  'des garanties financières actuelles pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    await enregistrerOuModifierSiExistantes.call(
      this,
      this.lauréatWorld.identifiantProjet,
      this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapExempleToFixtureValues(exemple),
    );
  },
);

EtantDonné(
  'des garanties financières actuelles pour le projet lauréat',
  async function (this: PotentielWorld) {
    await enregistrerOuModifierSiExistantes.call(this, this.lauréatWorld.identifiantProjet, {});
  },
);

EtantDonné(
  'des garanties financières actuelles échues le {string} pour le projet lauréat',
  async function (this: PotentielWorld, dateÉchéance: string) {
    const { identifiantProjet } = this.lauréatWorld;
    const garantiesFinancières = {
      type: 'avec-date-échéance' as const,
      dateÉchéance: new Date(dateÉchéance).toISOString() as Iso8601DateTime,
    };

    await enregistrerOuModifierSiExistantes.call(this, identifiantProjet, garantiesFinancières);
  },
);

EtantDonné(
  'une exemption de garanties financières pour le projet lauréat',
  async function (this: PotentielWorld) {
    await enregistrerGarantiesFinancièresActuelles.call(this, this.lauréatWorld.identifiantProjet, {
      type: 'exemption',
    });
  },
);

EtantDonné(
  'des garanties financières déposées avec la candidature',
  async function (this: PotentielWorld) {
    this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.créer({
      type: this.candidatureWorld.importerCandidature.dépôtValue.typeGarantiesFinancières,
      dateÉchéance: this.candidatureWorld.importerCandidature.dépôtValue.dateÉchéanceGf,
    });
  },
);

export async function enregistrerAttestation(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  props: Partial<EnregistrerGarantiesFinancièresProps>,
) {
  const { dateConstitution, attestation, enregistréLe, enregistréPar } =
    this.lauréatWorld.garantiesFinancièresWorld.actuelles.enregistrerAttestation.créer({
      enregistréPar: this.utilisateurWorld.porteurFixture.email,
      ...props,
    });
  await mediator.send<Lauréat.GarantiesFinancières.EnregistrerAttestationGarantiesFinancièresUseCase>(
    {
      type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        enregistréLeValue: enregistréLe,
        enregistréParValue: enregistréPar,
        dateConstitutionValue: dateConstitution,
        attestationValue: convertFixtureFileToReadableStream(attestation),
      },
    },
  );
}

export async function enregistrerGarantiesFinancièresActuelles(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  props: Partial<EnregistrerGarantiesFinancièresProps>,
) {
  const { dateÉchéance, type, dateConstitution, attestation, enregistréLe, enregistréPar } =
    this.lauréatWorld.garantiesFinancièresWorld.actuelles.enregistrer.créer({
      enregistréPar: this.utilisateurWorld.porteurFixture.email,
      ...props,
    });
  await mediator.send<Lauréat.GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
    type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
    data: {
      typeValue: type,
      dateÉchéanceValue: dateÉchéance,
      identifiantProjetValue: identifiantProjet.formatter(),
      enregistréLeValue: enregistréLe,
      enregistréParValue: enregistréPar,
      dateConstitutionValue: dateConstitution,
      attestationValue: convertFixtureFileToReadableStream(attestation),
    },
  });
}

export async function modifierGarantiesFinancièresActuelles(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  props: Partial<EnregistrerGarantiesFinancièresProps>,
) {
  const { type, dateÉchéance, dateConstitution, attestation, enregistréLe, enregistréPar } =
    this.lauréatWorld.garantiesFinancièresWorld.actuelles.modifier.créer({
      enregistréPar: this.utilisateurWorld.adminFixture.email,
      ...props,
    });
  await mediator.send<Lauréat.GarantiesFinancières.ModifierGarantiesFinancièresUseCase>({
    type: 'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
    data: {
      typeValue: type,
      dateÉchéanceValue: dateÉchéance,
      identifiantProjetValue: identifiantProjet.formatter(),
      modifiéLeValue: enregistréLe,
      modifiéParValue: enregistréPar,
      dateConstitutionValue: dateConstitution,
      attestationValue: convertFixtureFileToReadableStream(attestation),
    },
  });
}

async function enregistrerOuModifierSiExistantes(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  garantiesFinancières: Partial<EnregistrerGarantiesFinancièresProps>,
) {
  try {
    await enregistrerGarantiesFinancièresActuelles.call(
      this,
      identifiantProjet,
      garantiesFinancières,
    );
  } catch (e) {
    if (
      e instanceof Error &&
      e.message === 'Il y a déjà des garanties financières pour ce projet'
    ) {
      await modifierGarantiesFinancièresActuelles.call(
        this,
        identifiantProjet,
        garantiesFinancières,
      );
    } else {
      throw e;
    }
  }
}
