'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';

import { Routes } from '@potentiel-libraries/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { transmettrePreuveRecandidatureAction } from './transmettrePreuveRecandidature.action';

type ProjetÀSélectionner = {
  identifiantProjet: string;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  dateDésignation: string;
  nom: string;
};

export type TransmettrePreuveRecandidaturePageProps = {
  projet: ProjetBannerProps;
  projetsÀSélectionner: Array<ProjetÀSélectionner>;
};

export const TransmettrePreuveRecandidaturePage: FC<TransmettrePreuveRecandidaturePageProps> = ({
  projet,
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
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <Heading1>Transmettre preuve de recandidature</Heading1>
      {projetsÀSélectionner.length > 0 ? (
        <Form
          action={transmettrePreuveRecandidatureAction}
          method="post"
          onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
          onSuccess={() => router.push(Routes.Abandon.détail(projet.identifiantProjet))}
        >
          <input type={'hidden'} value={projet.identifiantProjet} name="identifiantProjet" />

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
              <input
                type={'hidden'}
                value={projetSélectionné.dateDésignation}
                name="dateDesignation"
              />
            </>
          )}

          <SubmitButton disabledCondition={() => !projetSélectionné}>
            Transmettre la preuve de recandidature
          </SubmitButton>
        </Form>
      ) : (
        <p>Vous ne disposez d'aucun projet éligible avec une preuve de recandidature</p>
      )}
    </PageTemplate>
  );
};
