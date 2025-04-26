import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/index.js'; 
import cors from 'cors';
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';
import chokidar from 'chokidar';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST'],
    }
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use('/api', apiRouter);

app.get('/ping', (req, res) => {
    return res.json({message: 'pong'});
});

const editorNamespace = io.of('/editor');

editorNamespace.on('connection', (socket) => {
    console.log('editor connected');

    //somehow we will get the projectId from the frontend
    let projectId = socket.handshake.query['projectId'];

    console.log('Project id received after connection', projectId);
    
    if(projectId) {
        var watcher = chokidar.watch(`./projects/${projectId}`, {
            persistent: true, /** Keeps the watcher in the running state till the time app is running  */
            awaitWriteFinish: {
                stabilityThreshold: 2000 /** Ensures stability of files before triggering event */
            },
            ignoredInitial: true /** Ignores the initial files in the directory */
        });

        watcher.on("all", (event, path) => {
            console.log(event, path);
        });
    }

    handleEditorSocketEvents(socket, editorNamespace);
    
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});