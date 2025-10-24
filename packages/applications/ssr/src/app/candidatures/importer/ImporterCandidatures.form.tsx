'use client';

import { FC, useEffect, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useSearchParams } from 'next/navigation';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ImporterCandidaturesParCSVForm } from './(csv)/ImporterCandidaturesParCSV.form';
import { ImporterCandidaturesParDSForm } from './(demarche-simplifiée)/ImporterCandidaturesParDS.form';

export type ImporterCandidaturesFormProps = {
  périodes: PlainType<Période.ListerPériodeItemReadModel[]>;
};
export const ImporterCandidaturesForm: FC<ImporterCandidaturesFormProps> = ({ périodes }) => {
  const searchParams = useSearchParams();

  const appelOffres = Object.groupBy(périodes, (p) => p.identifiantPériode.appelOffre);

  const [state, setState] = useState<{
    appelOffre: string | undefined;
    période: string | undefined;
    typeImport: AppelOffre.Periode['typeImport'] | undefined;
  }>({
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
    typeImport: undefined,
  });

  useEffect(() => {
    if (state.appelOffre && state.période) {
      const type = périodes.find(
        (p) =>
          p.identifiantPériode.appelOffre === state.appelOffre &&
          p.identifiantPériode.période === state.période,
      )?.typeImport;
      setState((prev) => ({ ...prev, typeImport: type }));
    } else {
      setState((prev) => ({ ...prev, typeImport: undefined }));
    }
  }, [state.appelOffre, state.période]);

  return (
    <div>
      <div className="mb-6">
        Veuillez saisir{' '}
        <span className="font-semibold">
          {!state.appelOffre && !state.période
            ? "un appel d'offres et une période"
            : !state.appelOffre
              ? "un appel d'offres"
              : 'une période'}
        </span>
      </div>

      <div className="flex gap-4">
        <Select
          label="Appel Offre"
          options={Object.keys(appelOffres).map((appelOffre) => ({
            label: appelOffre,
            value: appelOffre,
          }))}
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
          disabled={!state.appelOffre}
        />
      </div>

      {state.typeImport &&
        match(state.typeImport)
          .with('csv', () => (
            <ImporterCandidaturesParCSVForm
              appelOffre={state.appelOffre!}
              période={state.période!}
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
  );
};
