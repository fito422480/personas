const sanitize = (value?: string) =>
  value
    ?.replace(/\\r\\n/g, "")
    .replace(/\r?\n/g, "")
    .replace(/[\\"]/g, "")
    .trim();

export default () => ({
  app: {
    port: Number(process.env.PORT ?? 3000),
  },
  auth: {
    jwtSecret: sanitize(process.env.JWT_SECRET),
  },
  providers: {
    plraTokens: (sanitize(process.env.PLRA_TOKENS) ?? "")
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean),
    redis: {
      url: sanitize(process.env.REDIS_URL),
      username: sanitize(process.env.REDIS_USERNAME),
      password: sanitize(process.env.REDIS_PASSWORD),
      host: sanitize(process.env.REDIS_HOST),
      port: Number(sanitize(process.env.REDIS_PORT) ?? 6379),
    },
  },
});
