'use client';

import Button from '@codegouvfr/react-dsfr/Button';

export const ImpressionPageHistoriqueLauréat = () => (
  <Button
    priority="primary"
    iconId="fr-icon-printer-line"
    className="print:hidden ml-auto"
    onClick={(event) => {
      event.preventDefault();
      window.print();
    }}
  >
    Imprimer la page
  </Button>
);
