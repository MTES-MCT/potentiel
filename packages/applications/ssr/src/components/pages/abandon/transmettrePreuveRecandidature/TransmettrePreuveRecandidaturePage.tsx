'use client';

import { FC, useState } from 'react';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { Form } from '@/components/atoms/form/Form';
import { transmettrePreuveRecandidatureAction } from './transmettrePreuveRecandidature.action';
import { useRouter } from 'next/navigation';
import { Routes } from '@potentiel-libraries/routes';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

type ProjetÀSélectionner = {
  identifiantProjet: string;
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

  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <Heading1>Transmettre preuve de recandidature</Heading1>
      {projetsÀSélectionner.length > 0 ? (
        <Form
          action={transmettrePreuveRecandidatureAction}
          method="post"
          onSuccess={() => router.push(Routes.Abandon.détail(projet.identifiantProjet))}
        >
          <input type={'hidden'} value={projet.identifiantProjet} name="identifiantProjet" />

          <SelectNext
            label="Choisir un projet comme preuve de recandidature"
            placeholder={`Sélectionner un projet`}
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
              label: projet.nom,
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
