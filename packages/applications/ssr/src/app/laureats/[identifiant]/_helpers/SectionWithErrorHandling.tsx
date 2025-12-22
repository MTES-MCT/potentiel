import Notice from '@codegouvfr/react-dsfr/Notice';
import { captureException } from '@sentry/core';

import { OperationRejectedError } from '@potentiel-domain/core';

import { Section } from '../(détails)/(components)/Section';

export const SectionWithErrorHandling = async (
  render: Promise<JSX.Element | null> | (() => Promise<JSX.Element | null>),
  title: string,
) => {
  try {
    if (typeof render === 'function') {
      return await render();
    }
    return await render;
  } catch (e) {
    try {
      captureException(e, { data: { location: 'section-page-projet', title } });
    } catch {}

    if (e instanceof OperationRejectedError) {
      return (
        <Section title={title ?? 'Erreur'}>
          <Notice
            severity="info"
            title="Accès refusé"
            description="Vous n'avez pas la permission de voir cette section."
          />
        </Section>
      );
    }

    return (
      <Section title={title ?? 'Erreur'}>
        <Notice
          severity="warning"
          title="Erreur de chargement"
          description="Une erreur est survenue lors du chargement de cette section."
        />
      </Section>
    );
  }
};
