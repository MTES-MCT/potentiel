'use client';

import { FC, useState } from 'react';
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
  importMultipleAOEtPeriodesPossible: boolean;
};

type State = {
  appelOffre: string | undefined;
  période: string | undefined;
  typeImport: AppelOffre.Periode['typeImport'] | undefined;
  modeMultiple: boolean;
};

export const ImporterCandidaturesForm: FC<ImporterCandidaturesFormProps> = ({
  périodes,
  importMultipleAOEtPeriodesPossible,
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
    typeImport: importMultipleAOEtPeriodesPossible ? 'csv' : undefined,
    modeMultiple: importMultipleAOEtPeriodesPossible,
  });

  return (
    <div>
      {importMultipleAOEtPeriodesPossible && (
        <Checkbox
          id="importMultipleAOEtPeriode"
          options={[
            {
              label: "Autoriser l'import avec plusieurs appel d'offres et périodes",
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
                defaultChecked: importMultipleAOEtPeriodesPossible,
                onChange: (ev) =>
                  setState((prev) => ({
                    ...prev,
                    appelOffre: undefined,
                    période: undefined,
                    modeMultiple: ev.target.checked,
                  })),
              },
            },
          ]}
        />
      )}

      {!state.modeMultiple && (
        <div className="flex items-start flex-col md:flex-row md:gap-6">
          <Select
            label="Appel Offres"
            options={Object.keys(appelOffres).map((appelOffre) => ({
              label: appelOffre,
              value: appelOffre,
            }))}
            state={state.appelOffre ? 'default' : 'error'}
            stateRelatedMessage={state.appelOffre ? undefined : `Veuillez saisir un appel d'offres`}
            nativeSelectProps={{
              name: 'appelOffre',
              value: state.appelOffre,
              onChange: (ev) => {
                const périodesPourAppelOffre = périodes.filter(
                  (période) => période.identifiantPériode.appelOffre === ev.target.value,
                );

                const période =
                  périodesPourAppelOffre.length === 1 ? périodesPourAppelOffre[0] : undefined;

                setState((prev) => ({
                  ...prev,
                  appelOffre: ev.target.value,
                  période: période ? période.identifiantPériode.période : undefined,
                  typeImport: période ? période.typeImport : undefined,
                }));
              },
              required: true,
            }}
          />

          <Select
            label="Période"
            disabled={!state.appelOffre}
            state={state.période ? 'default' : 'error'}
            stateRelatedMessage={state.période ? undefined : `Veuillez saisir une période`}
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
              onChange: ({ target: { value } }) =>
                setState((prev) => {
                  const période = périodes.find(
                    (p) =>
                      p.identifiantPériode.appelOffre === state.appelOffre &&
                      p.identifiantPériode.période === value,
                  );

                  return {
                    ...prev,
                    période: période ? période.identifiantPériode.période : undefined,
                    typeImport: période ? période.typeImport : undefined,
                  };
                }),
              required: true,
            }}
          />
        </div>
      )}

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
