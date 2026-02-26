# Personas API (NestJS)

API en NestJS para consultar padrón electoral, con autenticación JWT, cache en Redis y capa de resiliencia para llamadas al proveedor externo (PLRA).

## Caracteristicas

- NestJS 11 + TypeScript.
- Endpoint de login para emitir JWT.
- Endpoint protegido para consulta de padrón por cédula.
- Cache en Redis para reducir llamadas repetidas.
- Retry + circuit breaker para robustez frente a fallos del proveedor externo.
- Validación global de entrada y variables de entorno.

## Requisitos

- Node.js 20+ (recomendado).
- npm 10+.
- Redis disponible (local o cloud).

## Instalacion

```bash
npm install
```

## Configuracion

Crea tu `.env` basado en `.env.example`.

Variables principales:

- `PORT`: puerto local de la API.
- `JWT_SECRET`: clave para firmar tokens JWT (minimo 12 caracteres).
- `PLRA_TOKENS`: tokens para consumir PLRA separados por coma.
- `REDIS_URL`: URL de Redis (ej. `redis://localhost:6379`).
- `REDIS_USERNAME`: usuario Redis (cuando no uses `REDIS_URL`).
- `REDIS_PASSWORD`: password Redis (cuando no uses `REDIS_URL`).
- `REDIS_HOST`: host Redis (cuando no uses `REDIS_URL`).
- `REDIS_PORT`: puerto Redis (cuando no uses `REDIS_URL`).

La conexion Redis acepta dos modos:

1. `REDIS_URL`.
2. `REDIS_HOST` + `REDIS_PORT` + `REDIS_PASSWORD` (`REDIS_USERNAME` opcional, por defecto `default`).

## Ejecucion

Desarrollo:

```bash
npm run start:dev
```

Produccion:

```bash
npm run build
npm run start:prod
```

## Scripts

- `npm run start`: arranca la app.
- `npm run start:dev`: arranca en modo watch.
- `npm run build`: compila a `dist/`.
- `npm test`: pruebas unitarias.
- `npm run test:e2e`: pruebas e2e.
- `npm run lint`: lint con autofix.

## Endpoints

Base URL local: `http://localhost:3000/api`

### Health

- `GET /health`

Respuesta:

```json
{ "status": "ok" }
```

### Auth

- `POST /auth/login`
- `GET /auth/login`

`POST /auth/login` body opcional:

```json
{
  "sub": "dev-user",
  "name": "Carlos"
}
```

Respuesta:

```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Padron (protegido con JWT)

- `GET /padron/:cedula`
- Requiere header `Authorization: Bearer <access_token>`.

Ejemplo:

```bash
curl "http://localhost:3000/api/padron/5001263" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

## Integracion externa (PLRA)

La API interna consulta:

```bash
curl "https://plra.org.py/public/buscar_padron.php?cedula=1207867" \
  -H "Authorization: Bearer <TOKEN_PLRA>" \
  -H "Referer: https://plra.org.py/public/buscar_enrcp.php"
```

El token se toma de `PLRA_TOKENS` y se rota internamente.

## Estructura del proyecto

```text
src/
  auth/
  common/
    cache/
    http/
    resilience/
    token/
  config/
  modules/
    padron/
  app.module.ts
  main.ts
test/
```

## Flujo recomendado de uso

1. Llamar `POST /api/auth/login` para obtener JWT.
2. Consumir `GET /api/padron/:cedula` con `Bearer` token.
3. Verificar estado con `GET /api/health`.

## Troubleshooting rapido

- `401 Unauthorized` en `/api/padron/:cedula`: estas enviando un token invalido o expirado; usa `access_token` de `/api/auth/login`.
- `404 Cannot GET /api/auth/login`: verifica que la app este levantada con la version actual del codigo.
- Errores Redis: revisa `REDIS_URL` o credenciales `REDIS_HOST/PORT/PASSWORD`.
- Error de env al arrancar: valida variables requeridas en `.env`.

## Seguridad

- No subas tu `.env` al repositorio.
- Rota `JWT_SECRET` y tokens PLRA regularmente.
- Restringe CORS en produccion.

