'use client';

import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useSearchParams } from 'next/navigation';
import { match } from 'ts-pattern';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { PlainType } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';

import { ImporterCandidaturesParCSVForm } from './(csv)/ImporterCandidaturesParCSV.form';
import { ImporterCandidaturesParDSForm } from './(demarche-simplifiée)/ImporterCandidaturesParDS.form';

export type ImporterCandidaturesFormProps = {
  périodes: PlainType<Période.ListerPériodeItemReadModel[]>;
  importMultipleAOEtPeriodesPossible: boolean;
};

export const ImporterCandidaturesForm: FC<ImporterCandidaturesFormProps> = ({
  périodes,
  importMultipleAOEtPeriodesPossible,
}) => {
  const searchParams = useSearchParams();

  const [période, setPériode] = useState<Période.IdentifiantPériode.ValueType | undefined>(() => {
    const appelOffre = searchParams.get('appelOffre');
    const période = searchParams.get('periode');
    if (appelOffre && période) {
      return Période.IdentifiantPériode.bind({ appelOffre, période });
    }
  });

  const [modeMultiple, setModeMultiple] = useState(false);

  const typeImport = périodes.find(({ identifiantPériode }) =>
    période?.estÉgaleÀ(Période.IdentifiantPériode.bind(identifiantPériode)),
  )?.typeImport;

  return (
    <div>
      {importMultipleAOEtPeriodesPossible && (
        <Alert
          severity="info"
          className="mb-4"
          small
          title="Autoriser l'import avec plusieurs appel d'offres et périodes"
          description={
            <Checkbox
              id="importMultipleAOEtPeriode"
              className="my-2"
              small
              options={[
                {
                  label:
                    "Importer un fichier CSV contenant de multiples appels d'offres et périodes",
                  hintText: (
                    <>
                      Cette option est destinée aux{' '}
                      <span className="font-semibold">environnements de test uniquement</span>.{' '}
                      <br />
                    </>
                  ),
                  nativeInputProps: {
                    name: 'importMultipleAOEtPeriode',
                    value: 'true',
                    checked: modeMultiple,
                    onChange: (ev) => {
                      setModeMultiple(ev.target.checked);
                      setPériode(undefined);
                    },
                  },
                },
              ]}
            />
          }
        />
      )}

      {!modeMultiple && (
        <div className="flex items-start flex-col md:flex-row md:gap-6">
          <Select
            label="Période"
            state={période ? 'default' : 'error'}
            stateRelatedMessage={période ? undefined : `Veuillez saisir une période`}
            options={périodes
              .map(({ identifiantPériode }) => Période.IdentifiantPériode.bind(identifiantPériode))
              .map((identifiantPériode) => ({
                label: `${identifiantPériode.appelOffre} - P${identifiantPériode.période}`,
                value: identifiantPériode.formatter(),
              }))}
            nativeSelectProps={{
              name: 'periode',
              value: période?.formatter(),
              onChange: ({ target: { value } }) =>
                setPériode(Période.IdentifiantPériode.convertirEnValueType(value)),
              required: true,
            }}
          />
        </div>
      )}

      {modeMultiple && <ImporterCandidaturesParCSVForm modeMultiple={true} />}

      {typeImport && période && (
        <div className="mt-6 md:mt-0">
          {match(typeImport)
            .with('csv', () => (
              <ImporterCandidaturesParCSVForm
                appelOffre={période?.appelOffre}
                période={période?.période}
              />
            ))
            .with('démarche-simplifiée', () => (
              <ImporterCandidaturesParDSForm
                appelOffre={période.appelOffre}
                période={période.période}
              />
            ))
            .exhaustive()}
        </div>
      )}
    </div>
  );
};
