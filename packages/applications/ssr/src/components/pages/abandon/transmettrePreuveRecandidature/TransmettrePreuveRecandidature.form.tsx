'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { transmettrePreuveRecandidatureAction } from './transmettrePreuveRecandidature.action';

type ProjetÀSélectionner = {
  identifiantProjet: string;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  dateDésignation: Iso8601DateTime;
  nom: string;
};

export type TransmettrePreuveRecandidatureFormProps = {
  identifiantProjet: string;
  projetsÀSélectionner: Array<ProjetÀSélectionner>;
};

export const TransmettrePreuveRecandidatureForm: FC<TransmettrePreuveRecandidatureFormProps> = ({
  identifiantProjet,
  projetsÀSélectionner,
}) => {
  const router = useRouter();
  const [projetSélectionné, setProjetSélectionné] = useState<{
    identifiantProjet: ProjetÀSélectionner['identifiantProjet'];
    dateDésignation: ProjetÀSélectionner['dateDésignation'];
  }>();

  const getProjectLabel = (projet: ProjetÀSélectionner) =>
    `${projet.nom} | ${projet.appelOffre}-P${projet.période}${
      projet.famille ? `-${projet.famille}` : ''
    }-${projet.numéroCRE}`;

  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <Form
      action={transmettrePreuveRecandidatureAction}
      method="POST"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      onSuccess={() => router.push(Routes.Abandon.détail(identifiantProjet))}
      actionButtons={
        <SubmitButton disabledCondition={() => !projetSélectionné}>
          Transmettre la preuve de recandidature
        </SubmitButton>
      }
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <SelectNext
        label="Choisir un projet comme preuve de recandidature"
        placeholder={`Sélectionner un projet`}
        state={validationErrors.includes('preuveRecandidature') ? 'error' : 'default'}
        stateRelatedMessage="La sélection du projet est obligatoire"
        nativeSelectProps={{
          onChange: ({ currentTarget: { value } }) => {
            const projet = projetsÀSélectionner.find(
              (projet) => projet.identifiantProjet === value,
            );

            if (projet) {
              setProjetSélectionné({
                identifiantProjet: projet.identifiantProjet,
                dateDésignation: projet.dateDésignation,
              });
            }
          },
        }}
        options={projetsÀSélectionner.map((projet) => ({
          label: getProjectLabel(projet),
          value: projet.identifiantProjet,
        }))}
      />

      {projetSélectionné && (
        <>
          <input
            type={'hidden'}
            value={projetSélectionné.identifiantProjet}
            name="preuveRecandidature"
          />
          <input type={'hidden'} value={projetSélectionné.dateDésignation} name="dateDesignation" />
        </>
      )}
    </Form>
  );
};
