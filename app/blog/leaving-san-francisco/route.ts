import { goneResponse } from '#/lib/gone';

export const dynamic = 'force-static';

export function GET() {
  return goneResponse();
}
