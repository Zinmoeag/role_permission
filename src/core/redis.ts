import { createClient } from "redis";

const redisClient = createClient({
    password: 'BNnYMDfekPxFilUfkKIeaQhoDdEIRGYm',
    socket: {
        host: 'redis-12368.c14.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 12368
    }
});

redisClient.on("error", err => {
    redisClient.disconnect();
    console.log("redis client error| disconnected", err)
})

redisClient.connect().then(() => console.log("Redis client connected")).catch(err => console.log(err));

export default redisClient