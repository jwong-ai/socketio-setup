import {Server, Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {Pinpoint} from "aws-sdk";

export const additionalEventHandlers = (
	io: Server<DefaultEventsMap, DefaultEventsMap, any>,
	socket:  Socket<DefaultEventsMap, DefaultEventsMap, any>,
	awsPinpointClient?: Pinpoint,
) => {
	console.log('Registering additional event handlers');
	// No-ops here, but we can pass the object references to individual event handler files.
}