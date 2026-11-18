// Evaluated before the API handlers so their import-time env loader
// does not touch the filesystem. Workers replace NODE_ENV at build time.
if (!process.env.VERCEL_ENV) {
    process.env.VERCEL_ENV = 'production';
}
