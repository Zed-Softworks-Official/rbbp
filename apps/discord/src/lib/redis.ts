import { Redis } from "@upstash/redis";

import { api } from "@rbbp/backend/api";
import { convex } from "~/lib/convex";

import { env } from "~/env";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export async function loadProtectedRoles(guildId: string) {
  const roles = await convex.query(api.roles.getProtectedRoles, {
    guildId,
  });

  if (roles.length === 0) return;
  const key = getKey(guildId);

  const pipeline = redis.pipeline();
  pipeline.del(key);
  for (const role of roles) {
    pipeline.sadd(key, role.roleId);
  }
  pipeline.expire(key, 3600);

  await pipeline.exec();
}

export async function isProtectedRole(guildId: string, roleId: string) {
  const exists = await redis.sismember(getKey(guildId), roleId);

  if (!exists) {
    const cached = await redis.exists(getKey(guildId));
    if (!cached) {
      await loadProtectedRoles(guildId);
      return redis
        .sismember(getKey(guildId), roleId)
        .then((exists) => exists === 1);
    }
  }

  return exists === 1;
}

export async function cache(guildId: string, roleId: string) {
  await redis.sadd(getKey(guildId), roleId);
}

export async function invalidate(guildId: string, roleId: string) {
  await redis.srem(getKey(guildId), roleId);
}

export async function invalidateGuild(guildId: string) {
  await redis.del(getKey(guildId));
}

function getKey(guildId: string) {
  return `protected:${guildId}`;
}
