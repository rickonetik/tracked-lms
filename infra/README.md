# Infrastructure

Docker Compose setup for local development.

## Services

### PostgreSQL

**Важно:** Если у вас локальный Postgres занимает порт 5432 — используем порт 5433 для Docker контейнера.

- Port: `5433:5432` (host:container)
- User: `tracked_lms`
- Password: `tracked_lms_pass`
- Database: `tracked_lms`

### Redis

- Port: `6379:6379`
- No password required

### MinIO

- API Port: `9000:9000`
- Console Port: `9001:9001`
- Root User: `minioadmin`
- Root Password: `minioadmin`

## Usage

```bash
# Start all services
docker compose -f infra/docker-compose.yml up -d

# Stop all services
docker compose -f infra/docker-compose.yml down

# View logs
docker compose -f infra/docker-compose.yml logs -f

# Check status
docker compose -f infra/docker-compose.yml ps
```

## Environment Variables

Set in `.env` file:

- `POSTGRES_PORT` - PostgreSQL port mapping (default: 5433)
- `POSTGRES_USER` - PostgreSQL user (default: tracked_lms)
- `POSTGRES_PASSWORD` - PostgreSQL password (default: tracked_lms_pass)
- `POSTGRES_DB` - PostgreSQL database name (default: tracked_lms)
- `REDIS_PORT` - Redis port mapping (default: 6379)
- `MINIO_PORT` - MinIO API port (default: 9000)
- `MINIO_CONSOLE_PORT` - MinIO Console port (default: 9001)

## Database Connection

For applications connecting from host:

```
DATABASE_URL=postgresql://tracked_lms:tracked_lms_pass@localhost:5433/tracked_lms?schema=public
```
