import "dotenv/config";

import http from 'node:http';
import path from 'node:path';

import express from 'express';
import { Server } from 'socket.io';
import cookieParser from "cookie-parser";

import { publisher } from './redis-connection.js';
import { subscribe } from './redis-connection.js';
import { redis } from './redis-connection.js';

import authRoutes from "./src/module/auth/auth.routes.js";
import { socketAuthMiddleware } from "./src/socket-auth.js";

import connectDB from "./src/common/config/db.js";

const rateLimitingHashMap = new Map();
const chkboxCount = 1000;
const checkBox_State_Key = 'checkbox-state-V01';

// const state ={
//     checkboxes: new Array(chkboxCount).fill(false),
// };

console.log("MONGO_URI:", process.env.MONGO_URI);
await connectDB();

async function main() {


    const app = express();
    const server = http.createServer(app);
    const PORT = process.env.PORT ?? 8000;
    const io = new Server();
    io.attach(server);
    io.use(socketAuthMiddleware);



    await subscribe.subscribe('internal-server:checkbox:change');
    subscribe.on('message', (channel, message) => {
        if (channel === 'internal-server:checkbox:change') {
            const { index, checked } = JSON.parse(message);
            // state.checkboxes[index] = checked;
            io.emit('server:checkbox:change', { index, checked });
        }
    })


    // Meaning:
    //Socket IO Handlers
    io.on('connection', (socket) => {

        if (!socket.user) {
            socket.emit("server:error", {
                message: "Please login to update checkboxes.",
            });
            return;
        }
        const rateLimitKey = socket.user.id;

        console.log('A user connected', { id: rateLimitKey });

        socket.on('client:checkbox:change', async (data) => {
            console.log(`[Socket:${rateLimitKey}]:client:checkbox:change`, data);

            // set rate limit witl last action time------  

            // const lastOperationTime = rateLimitingHashMap.get(socket.id)
            const rateLimitRedisKey = `server:rate-limit:${rateLimitKey}`;

            const lastOperationTime = await redis.get(rateLimitRedisKey) || 0;

            if (lastOperationTime) {
                const timeElapsed = Date.now() - lastOperationTime;
                if (timeElapsed < (5 * 1000))
                    socket.emit("server:error", {
                        message: "Please login to update checkboxes.",
                    });
                return;
            }

            await redis.set(rateLimitRedisKey, Date.now(), "EX", 5)

            // ---- Using socket.io------
            // io.emit('server:checkbox:Change', data);
            // state.checkboxes[data.index] = data.checked;

            //------ Using Redis------
            const existingState = await redis.get((checkBox_State_Key));
            if (existingState) {
                const remoteData = JSON.parse(existingState);
                remoteData[data.index] = data.checked;
                redis.set(checkBox_State_Key, JSON.stringify(remoteData));
            }
            else {

                redis.set(checkBox_State_Key, JSON.stringify(new Array(chkboxCount).fill(false)));
            }

            publisher.publish('internal-server:checkbox:change', JSON.stringify(data));
        });

        socket.on("disconnect", () => {
            rateLimitingHashMap.delete(rateLimitKey);
        });


    });
    app.use(express.json());
    app.use(cookieParser());
    app.use("/api/auth", authRoutes);
    //Express Handlers
    app.use(express.static(path.resolve('./public')));

    app.get('/health', (req, res) => res.json({ healthy: true }));

    app.get('/checkboxes', async (req, res) => {
        const existingState = await redis.get((checkBox_State_Key));
        if (existingState) {
            const remoteData = JSON.parse(existingState);
            return res.json({ checkboxes: remoteData });
        }
        return res.json({ checkboxes: new Array(chkboxCount).fill(false) });
    });

    server.listen(PORT, () => {


        console.log(`Server is listening on http://localhost:${PORT}`);

    });
}

main();