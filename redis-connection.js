import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redis = new Redis(REDIS_URL);
export const publisher = new Redis(REDIS_URL);

export const subscribe = new Redis(REDIS_URL, {
  enableReadyCheck: false,
});

redis.on("error", (err) => console.error("Redis error:", err.message));
publisher.on("error", (err) => console.error("Redis publisher error:", err.message));
subscribe.on("error", (err) => console.error("Redis subscriber error:", err.message));