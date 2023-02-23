// import {
// 	MessageBody,
// 	OnGatewayConnection,
// 	OnGatewayDisconnect,
// 	OnGatewayInit, SubscribeMessage,
// 	WebSocketGateway,
// 	WebSocketServer
// } from "@nestjs/websockets";
// import { Logger } from "@nestjs/common";
// import { Server, Socket } from "net";
//
// @WebSocketGateway(4166, {
// 	transports: ['websocket'],
// 	namespace: 'hihi'
// })
//
// export class AppGateway
// 	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
// 	constructor() {
// 	}
//
// 	@WebSocketServer() server: Server;
// 	private logger: Logger = new Logger('AppGateway');
//
// 	@SubscribeMessage('events')
// 	handleEvent(@MessageBody() data: string): string {
// 		return data;
// 	}
//
// 	afterInit(server: Server) {
// 		this.logger.log('Init');
// 	}
//
// 	handleDisconnect(client: Socket) {
// 		this.logger.log(`Client Disconnected : ${client.id}`);
// 	}
//
// 	handleConnection(client: Socket, ...args: any[]) {
// 		this.logger.log(`Client Connected : ${client.id}`);
// 	}
// }
