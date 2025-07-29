import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';
import { setDépôtData } from '../../dépôt/stepDefinitions/helper';
import { EnregistrerGarantiesFinancièresProps } from '../fixtures/enregistrerGarantiesFinancières.fixture';

import { setGarantiesFinancièresData } from './helper';

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
  'des garanties financières actuelles échues pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: setDépôtData({
        identifiantProjet,
        exemple,
      }),
    });

    await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
      data: setGarantiesFinancièresData({
        identifiantProjet,
        exemple,
      }),
    });

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
      ...props,
      enregistréPar: this.utilisateurWorld.adminFixture.email,
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
