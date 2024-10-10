// Load the environment variables before importing any other modules
import {additionalEventHandlers} from "./src/events/handlers";

require('dotenv').config({
	debug: false,
});
import {createAWSPinpointClient} from './src/services/clients';
import {Socket, Server} from 'socket.io';
import {verifyIdToken} from './src/services/authentication';
import express from 'express';
import http from 'http';


const awsPinpointClient = createAWSPinpointClient();

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
		// Retrieve token passed in the connection event request
		let token = socket.handshake.auth.token;
		let decodedIdToken = await verifyIdToken(token);

		// If the token is invalid, immediately disconnect the socket
		if (!decodedIdToken) {
			socket.disconnect();
			return;
		}

		// TODO: Parse any additional info that has been encoded in the token

		console.log('NEW SOCKET: ' + socket.id);

		// Only register the handlers if this is a valid socket connection

		socket.on('disconnect', async () => {
			console.log('DISCONNECTED: ' + socket.id);
		});

		additionalEventHandlers(io, socket, awsPinpointClient);


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
