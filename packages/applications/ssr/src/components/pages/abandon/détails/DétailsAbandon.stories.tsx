import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';

import { DétailsAbandonPage, DétailsAbandonPageProps } from './DétailsAbandon.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Abandon/Détails',
  component: DétailsAbandonPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DétailsAbandonPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const identifiantProjet = '1#1##1';

const getProjetsÀSélectionner = () => {
  const projetsÀSélectionner: DétailsAbandonPageProps['projetsÀSélectionner'] = [];
  for (let i = 0; i < 10; i += 1) {
    projetsÀSélectionner.push({
      appelOffre: `Appel d'offre ${i}`,
      période: `${i}`,
      famille: `${i}`,
      numéroCRE: `${i}`,
      nom: `Projet ${i}`,
      identifiantProjet: `CRE4-${i}#${i}##${i}`,
      dateDésignation: DateTime.convertirEnValueType('2022-01-01').formatter(),
    });
  }
  return projetsÀSélectionner;
};

export const Demandé: Story = {
  args: {
    identifiantProjet,
    historique: {
      items: [],
      range: {
        endPosition: 0,
        startPosition: 0,
      },
      total: 0,
    },
    abandon: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: {
        statut: 'demandé',
      },
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        estUneRecandidature: false,
        recandidature: {
          statut: {
            statut: 'non-applicable',
          },
        },
        raison: "Justification de l'abandon",
      },
    },
    actions: [],
    informations: [],
    projetsÀSélectionner: [],
  },
};

export const Confirmé: Story = {
  args: {
    identifiantProjet,
    historique: {
      items: [],
      range: {
        endPosition: 0,
        startPosition: 0,
      },
      total: 0,
    },
    abandon: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: {
        statut: 'demandé',
      },
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        estUneRecandidature: false,
        recandidature: {
          statut: {
            statut: 'non-applicable',
          },
        },
        raison: "Justification de l'abandon",
        confirmation: {
          demandéePar: {
            email: 'validateur@test.test',
          },
          demandéeLe: {
            date: new Date('2022-02-01').toISOString() as Iso8601DateTime,
          },
          confirméLe: {
            date: new Date('2022-02-01').toISOString() as Iso8601DateTime,
          },
          confirméPar: {
            email: 'porteur@test.test',
          },
          réponseSignée: {
            dateCréation: new Date('2022-02-01').toISOString() as Iso8601DateTime,
            format: 'image/png',
            identifiantProjet,
            typeDocument: Abandon.TypeDocumentAbandon.abandonÀConfirmer.formatter(),
          },
        },
      },
    },
    actions: [],
    informations: [],
    projetsÀSélectionner: [],
  },
};

export const Rejeté: Story = {
  args: {
    identifiantProjet,
    historique: {
      items: [],
      range: {
        endPosition: 0,
        startPosition: 0,
      },
      total: 0,
    },
    abandon: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: {
        statut: 'demandé',
      },
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        estUneRecandidature: false,
        recandidature: {
          statut: {
            statut: 'non-applicable',
          },
        },
        raison: "Justification de l'abandon",
        rejet: {
          rejetéPar: {
            email: 'validateur@test.test',
          },
          rejetéLe: {
            date: new Date('2022-02-01').toISOString() as Iso8601DateTime,
          },
          réponseSignée: {
            dateCréation: new Date('2022-02-01').toISOString() as Iso8601DateTime,
            format: 'image/png',
            identifiantProjet,
            typeDocument: Abandon.TypeDocumentAbandon.abandonRejeté.formatter(),
          },
        },
      },
    },
    actions: [],
    informations: [],
    projetsÀSélectionner: [],
  },
};

export const Accordé: Story = {
  args: {
    identifiantProjet,
    historique: {
      items: [],
      range: {
        endPosition: 0,
        startPosition: 0,
      },
      total: 0,
    },
    abandon: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: {
        statut: 'demandé',
      },
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        estUneRecandidature: false,
        recandidature: {
          statut: {
            statut: 'non-applicable',
          },
        },
        raison: "Justification de l'abandon",
        accord: {
          accordéPar: {
            email: 'validateur@test.test',
          },
          accordéLe: {
            date: new Date('2022-02-01').toISOString() as Iso8601DateTime,
          },
          réponseSignée: {
            dateCréation: new Date('2022-02-01').toISOString() as Iso8601DateTime,
            format: 'image/png',
            identifiantProjet,
            typeDocument: Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
          },
        },
      },
    },
    actions: [],
    informations: ['demande-de-mainlevée'],
    projetsÀSélectionner: [],
  },
};

export const AccordéAvecRecandidature: Story = {
  args: {
    identifiantProjet,
    historique: {
      items: [],
      range: {
        endPosition: 0,
        startPosition: 0,
      },
      total: 0,
    },
    abandon: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: {
        statut: 'demandé',
      },
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        estUneRecandidature: true,
        recandidature: {
          statut: {
            statut: 'en-attente',
          },
        },
        raison: "Justification de l'abandon",
        accord: {
          accordéPar: {
            email: 'validateur@test.test',
          },
          accordéLe: {
            date: new Date('2022-02-01').toISOString() as Iso8601DateTime,
          },
          réponseSignée: {
            dateCréation: new Date('2022-02-01').toISOString() as Iso8601DateTime,
            format: 'image/png',
            identifiantProjet,
            typeDocument: Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
          },
        },
      },
    },
    actions: [],
    informations: ['demande-de-mainlevée', 'demande-abandon-pour-recandidature'],
    projetsÀSélectionner: [],
  },
};

export const AccordéAvecRecandidatureAvecLienPourTransmettre: Story = {
  args: {
    identifiantProjet,
    historique: {
      items: [],
      range: {
        endPosition: 0,
        startPosition: 0,
      },
      total: 0,
    },
    abandon: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: {
        statut: 'demandé',
      },
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        estUneRecandidature: true,
        recandidature: {
          statut: {
            statut: 'en-attente',
          },
        },
        raison: "Justification de l'abandon",
        accord: {
          accordéPar: {
            email: 'validateur@test.test',
          },
          accordéLe: {
            date: new Date('2022-02-01').toISOString() as Iso8601DateTime,
          },
          réponseSignée: {
            dateCréation: new Date('2022-02-01').toISOString() as Iso8601DateTime,
            format: 'image/png',
            identifiantProjet,
            typeDocument: Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
          },
        },
      },
    },
    actions: [],
    informations: ['demande-de-mainlevée', 'demande-abandon-pour-recandidature'],
    projetsÀSélectionner: getProjetsÀSélectionner(),
  },
};
