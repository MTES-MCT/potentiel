import { toNextJsHandler } from 'better-auth/next-js';

import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export const { POST, GET } = toNextJsHandler(auth);
