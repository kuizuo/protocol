import { defineNitroConfig } from 'nitropack'
export default defineNitroConfig({
  storage: {
    redis: {
      driver: 'redis',
      /* redis connector options */
    },
    db: {
      driver: 'fs',
      base: './data/db',
    },
  },
})
