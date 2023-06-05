import React from 'react';

type ContainerProps = {
  className?: string;
  children?: React.ReactNode;
};

export const Container = ({ className = '', children }: ContainerProps) => (
  <div className={`xl:mx-auto xl:max-w-7xl px-2 lg:px-4 ${className}`}>{children}</div>
);
