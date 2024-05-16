import { NextRequest } from 'next/server';

export const getErrorUrl = ({ url }: NextRequest) => new URL('/error', url);
