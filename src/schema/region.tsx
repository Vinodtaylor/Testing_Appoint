import { z } from 'zod';

export const regionSchema = z.object({
  region_name: z.string().min(1, { message: 'Region name is required' }),
  region_image: z.string().url(), 
});
