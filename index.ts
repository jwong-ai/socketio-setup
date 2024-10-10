// Load the environment variables before importing any other modules
require('dotenv').config({
	debug: false,
});

import {additionalEventHandlers} from "./src/events/handlers";

import {Socket, Server} from 'socket.io';
import express from 'express';
import http from 'http';


const port = process.env.PORT ?? 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	perMessageDeflate: false,
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE']
	}
});



// Handle Socket.io connection
io.on('connection', async (socket: Socket) => {
	try {
		console.log(`CONNECTED: socket<${socket.id}>`);

		// NOTE: We can move these default Socket.IO event handlers to a separate file
		socket.on('disconnect', async () => {
			console.log(`DISCONNECTED: socket<${socket.id}>`);
		});

		socket.on('error', (error: any) => {
			console.error(`ERROR: socket<${socket.id}>`);
			console.error(error);
		});

		// Create a socket event to relay the message back to the client
		socket.on('echo', (data: any) => {
			console.log(`ECHO: socket<${socket.id}>`);
			socket.emit('echo', data);
		});

		// Register additional event handlers here to prevent a long list of handlers in this file
		additionalEventHandlers(io, socket);

	} catch (error) {
		console.error('Connection error!');
		console.error(error);
	}


});

app.use(express.json());

// Enable CORS
app.use((req: any, _res: any, next: any) => {
	req.io = io;
	next();
});


// Endpoint
app.get('/', (_req: any, res: any) => {
	res.sendStatus(200);
});


app.get('/health', (_req: any, res: any) => {
	res.json({
		status: 'ok',
	}).status(200);
});


app.get('/ping', (_req: any, res: any) => {
	res.json({
		status: 'ok',
	}).status(200);
});


server.listen(port, () => {
	console.log('Listening on port ' + port);
});
