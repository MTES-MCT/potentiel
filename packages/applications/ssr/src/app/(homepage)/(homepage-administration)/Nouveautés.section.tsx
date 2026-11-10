import Notification from '@codegouvfr/react-dsfr/picto/Notification';
import { mediator } from 'mediateur';
import { cacheLife, cacheTag } from 'next/cache';

import type { Nouveautés } from '@potentiel-domain/nouveautes';
import type { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { NouveautésDétails, type NouveautésDétailsProps } from './Nouveautés.détails';

const sectionTitle = 'Nouveautés';

export const NouveautésSection = () =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const nouveautés = await getNouveautés({ rôle: utilisateur.rôle });

      return (
        <Section
          title={sectionTitle}
          picto={<Notification color="green-emeraude" fontSize="large" />}
          className="border-none"
        >
          <NouveautésDétails nouveautés={nouveautés} />
        </Section>
      );
    }),
    sectionTitle,
  );

type GetNouveautésProps = {
  rôle: Role.ValueType;
};

const getNouveautés = async ({
  rôle,
}: GetNouveautésProps): Promise<NouveautésDétailsProps['nouveautés']> => {
  try {
    return await récupérerNouveautésEnCache(rôle.nom);
  } catch (error) {
    getLogger('getNouveautés').error(error as Error);
    return [];
  }
};

// Durée de validité du cache, en min. Dépassé ce délai, la nouvelle valeur est récupérée, mais ne sera rendu qu'au prochain call.
const DEFAULT_NEWS_CACHE_TIME_IN_MIN = 5;

// Durée maximale de vie (24h)
const NEWS_CACHE_EXPIRE_IN_SECONDS = 24 * 60 * 60;

const getNewsCacheTimeInSeconds = () => {
  const { NEWS_CACHE_TIME_IN_MIN } = process.env;

  const cacheTimeInMin =
    NEWS_CACHE_TIME_IN_MIN && Number(NEWS_CACHE_TIME_IN_MIN) > 0
      ? Number(NEWS_CACHE_TIME_IN_MIN)
      : DEFAULT_NEWS_CACHE_TIME_IN_MIN;

  return cacheTimeInMin * 60;
};

const récupérerNouveautésEnCache = async (
  rôle: Role.RawType,
): Promise<NouveautésDétailsProps['nouveautés']> => {
  'use cache';
  cacheLife({ revalidate: getNewsCacheTimeInSeconds(), expire: NEWS_CACHE_EXPIRE_IN_SECONDS });
  cacheTag('nouveautés');

  const { items } = await mediator.send<Nouveautés.ListerNouveautésQuery>({
    type: 'Nouveautés.Query.ListerNouveautés',
    data: { rôle, range: { startPosition: 0, endPosition: 1 } },
  });

  return items.map(mapToNouveautéSectionProps);
};

const mapToNouveautéSectionProps = ({
  titre,
  description,
  date,
  lien,
}: Nouveautés.NouveautéReadModel): NouveautésDétailsProps['nouveautés'][number] => ({
  title: titre,
  content: description,
  date: date?.formatter(),
  link: lien ? { href: lien, external: !estUnLienInterne(lien) } : undefined,
});

const estUnLienInterne = (lien: string) => lien.startsWith('/');
