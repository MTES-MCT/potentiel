import { Heading4 } from '@/components/atoms/headings';

import { Tile } from '../Tile';

export const LoginMethodTile = ({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <Tile className={`flex flex-col justify-between gap-4 lg:w-2/3 text-center py-6 ${className}`}>
    <div className="flex flex-col items-center gap-2">
      <Heading4>{title}</Heading4>
      <p className="max-w-lg xl:max-w-2xl text-center">{description}</p>
    </div>
    {children}
  </Tile>
);
