import { Heading4 } from '@/components/atoms/headings';

import { Tile } from '../Tile';

export const LoginMethodTile = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <Tile className="flex flex-col items-center gap-4 md:w-2/3 text-center py-8">
    <Heading4>{title}</Heading4>
    <p className="max-w-lg xl:max-w-2xl text-center">{description}</p>
    {children}
  </Tile>
);
