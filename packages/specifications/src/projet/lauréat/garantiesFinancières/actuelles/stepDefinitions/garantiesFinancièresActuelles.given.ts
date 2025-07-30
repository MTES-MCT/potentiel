import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';
import { EnregistrerGarantiesFinancièresProps } from '../fixtures/enregistrerGarantiesFinancières.fixture';

EtantDonné(
  'des garanties financières actuelles pour le projet {string} avec :',
  async function (this: PotentielWorld, _: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await enregistrerGarantiesFinancièresActuelles.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapExempleToFixtureValues(exemple),
      );
    } catch (e) {
      if (
        e instanceof Error &&
        e.message === 'Il y a déjà des garanties financières pour ce projet'
      ) {
        await modifierGarantiesFinancièresActuelles.call(
          this,
          this.lauréatWorld.identifiantProjet,
          this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapExempleToFixtureValues(exemple),
        );
      }
    }
  },
);

EtantDonné(
  'des garanties financières actuelles pour le projet {string}',
  async function (this: PotentielWorld, _: string) {
    try {
      await enregistrerGarantiesFinancièresActuelles.call(
        this,
        this.lauréatWorld.identifiantProjet,
        {},
      );
    } catch (e) {
      if (
        e instanceof Error &&
        e.message === 'Il y a déjà des garanties financières pour ce projet'
      ) {
        await modifierGarantiesFinancièresActuelles.call(
          this,
          this.lauréatWorld.identifiantProjet,
          {},
        );
      }
    }
  },
);

EtantDonné(
  'des garanties financières actuelles échues pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld;
    try {
      await enregistrerGarantiesFinancièresActuelles.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapExempleToFixtureValues(exemple),
      );
    } catch (e) {
      if (
        e instanceof Error &&
        e.message === 'Il y a déjà des garanties financières pour ce projet'
      ) {
        await modifierGarantiesFinancièresActuelles.call(
          this,
          this.lauréatWorld.identifiantProjet,
          {},
        );
      }
    }

    this.lauréatWorld.garantiesFinancièresWorld.actuelles.échoir.créer();

    await mediator.send<Lauréat.TâchePlanifiée.ExécuterTâchePlanifiéeUseCase>({
      type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        typeTâchePlanifiéeValue:
          Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
      },
    });
  },
);

EtantDonné(
  'une exemption de garanties financières pour le projet lauréat',
  async function (this: PotentielWorld) {
    await enregistrerGarantiesFinancièresActuelles.call(this, this.lauréatWorld.identifiantProjet, {
      garantiesFinancières: { type: 'exemption' },
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
        attestationValue: attestation,
      },
    },
  );
}

export async function enregistrerGarantiesFinancièresActuelles(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  props: Partial<EnregistrerGarantiesFinancièresProps>,
) {
  const { garantiesFinancières, dateConstitution, attestation, enregistréLe, enregistréPar } =
    this.lauréatWorld.garantiesFinancièresWorld.actuelles.enregistrer.créer({
      enregistréPar: this.utilisateurWorld.porteurFixture.email,
      ...props,
    });
  await mediator.send<Lauréat.GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
    type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      enregistréLeValue: enregistréLe,
      enregistréParValue: enregistréPar,
      garantiesFinancièresValue: garantiesFinancières,
      dateConstitutionValue: dateConstitution,
      attestationValue: attestation,
    },
  });
}

export async function modifierGarantiesFinancièresActuelles(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  props: Partial<EnregistrerGarantiesFinancièresProps>,
) {
  const { garantiesFinancières, dateConstitution, attestation, enregistréLe, enregistréPar } =
    this.lauréatWorld.garantiesFinancièresWorld.actuelles.modifier.créer({
      enregistréPar: this.utilisateurWorld.adminFixture.email,
      ...props,
    });
  await mediator.send<Lauréat.GarantiesFinancières.ModifierGarantiesFinancièresUseCase>({
    type: 'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      modifiéLeValue: enregistréLe,
      modifiéParValue: enregistréPar,
      garantiesFinancièresValue: garantiesFinancières,
      dateConstitutionValue: dateConstitution,
      attestationValue: attestation,
    },
  });
}
