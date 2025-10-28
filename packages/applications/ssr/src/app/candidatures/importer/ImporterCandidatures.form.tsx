'use client';

import { FC, useEffect, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useSearchParams } from 'next/navigation';
import { match } from 'ts-pattern';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';

import { PlainType } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ImporterCandidaturesParCSVForm } from './(csv)/ImporterCandidaturesParCSV.form';
import { ImporterCandidaturesParDSForm } from './(demarche-simplifiée)/ImporterCandidaturesParDS.form';

export type ImporterCandidaturesFormProps = {
  périodes: PlainType<Période.ListerPériodeItemReadModel[]>;
  importMultipleAOEtPeriodePossible: boolean;
};

type State = {
  appelOffre: string | undefined;
  période: string | undefined;
  typeImport: AppelOffre.Periode['typeImport'] | undefined;
  modeMultiple: boolean;
};

export const ImporterCandidaturesForm: FC<ImporterCandidaturesFormProps> = ({
  périodes,
  importMultipleAOEtPeriodePossible,
}) => {
  const searchParams = useSearchParams();

  const appelOffres = Object.groupBy(périodes, (p) => p.identifiantPériode.appelOffre);

  const [state, setState] = useState<State>({
    appelOffre:
      périodes.length === 1
        ? périodes[0].identifiantPériode.appelOffre
        : (searchParams.get('appelOffre') ?? undefined),
    période:
      périodes.length === 1
        ? périodes[0].identifiantPériode.période
        : ((searchParams.get('appelOffre') &&
            searchParams.get('periode') &&
            searchParams.get('periode')) ??
          undefined),
    typeImport: importMultipleAOEtPeriodePossible ? 'csv' : undefined,
    modeMultiple: importMultipleAOEtPeriodePossible,
  });

  useEffect(() => {
    if (state.modeMultiple) {
      setState((prev) => ({ ...prev, typeImport: 'csv' }));
    }

    if (state.appelOffre && state.période) {
      const type = périodes.find(
        (p) =>
          p.identifiantPériode.appelOffre === state.appelOffre &&
          p.identifiantPériode.période === state.période,
      )?.typeImport;
      setState((prev) => ({ ...prev, typeImport: type }));
    }
  }, [state.appelOffre, state.période, state.modeMultiple]);

  const displayMissingData = () => {
    if (state.modeMultiple || (state.appelOffre && state.période)) {
      return;
    }

    return (
      <div className="mt-6 md:mt-0">
        Veuillez saisir{' '}
        {match(state)
          .with({ appelOffre: undefined, période: undefined }, () => (
            <span className="font-semibold">un appel d'offres et une période</span>
          ))
          .with({ appelOffre: undefined }, () => (
            <span className="font-semibold">un appel d'offres</span>
          ))
          .with({ période: undefined }, () => <span className="font-semibold">une période</span>)
          .otherwise(() => null)}
      </div>
    );
  };

  return (
    <div>
      {importMultipleAOEtPeriodePossible && (
        <Checkbox
          id="importMultipleAOEtPeriode"
          options={[
            {
              label: "Autoriser l'import avec des AOs et périodes multiples",
              hintText: (
                <>
                  Cette option est destinée aux{' '}
                  <span className="font-semibold">environnements de test uniquement</span>. <br />
                  Elle permet de faire des imports de candidatures de plusieurs périodes et appels
                  d'offres en un seul fichier CSV.
                </>
              ),
              nativeInputProps: {
                name: 'importMultipleAOEtPeriode',
                value: 'true',
                defaultChecked: importMultipleAOEtPeriodePossible,
                onChange: (ev) =>
                  setState((prev) => ({
                    ...prev,
                    modeMultiple: ev.target.checked,
                    typeImport: undefined,
                  })),
              },
            },
          ]}
        />
      )}
      <div className="flex flex-col md:flex-row md:gap-4">
        <Select
          label="Appel Offre"
          options={Object.keys(appelOffres).map((appelOffre) => ({
            label: appelOffre,
            value: appelOffre,
          }))}
          disabled={state.modeMultiple}
          nativeSelectProps={{
            name: 'appelOffre',
            value: state.appelOffre,
            onChange: (ev) => {
              const périodesPourAppelOffre = périodes.filter(
                (période) => période.identifiantPériode.appelOffre === ev.target.value,
              );

              setState((prev) => ({
                ...prev,
                appelOffre: ev.target.value,
                période:
                  périodesPourAppelOffre.length === 1
                    ? périodesPourAppelOffre[0].identifiantPériode.période
                    : undefined,
              }));
            },
            required: true,
          }}
        />

        <Select
          label="Période"
          disabled={state.modeMultiple || !state.appelOffre}
          options={
            périodes
              .filter((période) => période.identifiantPériode.appelOffre == state.appelOffre)
              .map(({ identifiantPériode }) => ({
                label: identifiantPériode.période,
                value: identifiantPériode.période,
              }))
              .sort((a, b) => a.label.padStart(2, '0').localeCompare(b.label.padStart(2, '0'))) ??
            []
          }
          nativeSelectProps={{
            name: 'periode',
            value: state.période,
            onChange: (event) => setState((prev) => ({ ...prev, période: event.target.value })),
            required: true,
          }}
        />
      </div>

      {!state.modeMultiple && displayMissingData()}

      {state.typeImport && (
        <div className="mt-6 md:mt-0">
          {match(state.typeImport)
            .with('csv', () => (
              <ImporterCandidaturesParCSVForm
                appelOffre={state.appelOffre!}
                période={state.période!}
                modeMultiple={state.modeMultiple}
              />
            ))
            .with('démarche-simplifiée', () => (
              <ImporterCandidaturesParDSForm
                appelOffre={state.appelOffre!}
                période={state.période!}
              />
            ))
            .exhaustive()}
        </div>
      )}
    </div>
  );
};
