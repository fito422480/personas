export default () => ({
  app: {
    port: Number(process.env.PORT ?? 3000),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },
  providers: {
    plraTokens: (process.env.PLRA_TOKENS ?? "")
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean),
    redis: {
      url: process.env.REDIS_URL,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT ?? 6379),
    },
  },
});
