import http from 'node:http';
import path from 'node:path';

import express from 'express';
import {Server} from 'socket.io';

import {publisher} from './redis-connection.js';
import {subscribe} from './redis-connection.js';
import {redis} from './redis-connection.js';


const chkboxCount = 100;
const checkBox_State_Key = 'checkbox-state';

// const state ={
//     checkboxes: new Array(chkboxCount).fill(false),
// };

async function main() {

    
    const app = express();
    const server = http.createServer(app);
    const PORT = process.env.PORT ?? 8000;
    const io = new Server();
    io.attach(server);

   await subscribe.subscribe('internal-server:checkbox:change') ;
   subscribe.on('message', (channel, message) =>{
    if (channel === 'internal-server:checkbox:change'){
        const {index, checked}=JSON.parse(message);
        // state.checkboxes[index] = checked;
        io.emit('server:checkbox:change', {index, checked});
    }
   })

    //Socket IO Handlers
    io.on('connection', (socket) => {
        console.log('A user connected', {id: socket.id});

        socket.on('client:checkbox:change', async (data) => {
            console.log(`[Socket:${socket.id}]`, data);

            // set rate limit witl last action time------
            



            // ---- Using socket.io------
            // io.emit('server:checkbox:Change', data);
            // state.checkboxes[data.index] = data.checked;

            //------ Using Redis------
            const existingState = await redis.get((checkBox_State_Key));
            if(existingState){
                const remoteData = JSON.parse(existingState);
                remoteData[data.index] = data.checked;
                redis.set(checkBox_State_Key, JSON.stringify(remoteData));
            }
            else{

                redis.set(checkBox_State_Key, JSON.stringify(new Array(chkboxCount).fill(false)));
            }            

            publisher.publish('internal-server:checkbox:change', JSON.stringify(data));
        });
         
    });

    //Express Handlers
    app.use(express.static(path.resolve('./public')));

    app.get('/health', (req, res) => res.json({ healthy: true }));

    app.get('/checkboxes', async (req,res)=>{
        const existingState = await redis.get((checkBox_State_Key));
         if(existingState){
                const remoteData = JSON.parse(existingState);
                return res.json({checkboxes: remoteData});
         }
        return res.json({checkboxes: new Array(chkboxCount).fill(false)});
    });

    server.listen(PORT, () => {


        console.log(`Server is listening on http://localhost:${PORT}`);

    });
}

main();