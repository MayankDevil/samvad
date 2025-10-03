/* 
-	samvad-(version-0.0.4)
-   File: client.js
*/

class Client {

    constructor(id = null, name = null, isOnline = true) {
        
		this.id = id
		this.name = name
		this.isOnline = isOnline
	}

	disconnect() {

		if (this.isOnline) {
			this.isOnline = !this.isOnline
		}
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			isOnline: this.isOnline,
		}
	}
}

class Chat {

    constructor(sender = null, timestamp = null, data = null) {

        if (sender === null || timestamp === null || data === null) {
            console.warn('~ chat data is null')
            return
        }
		this.sender = sender
		this.timestamp = timestamp
		this.data = data
	}

	toJSON() {
		return {
			sender: this.sender,
			timestamp: this.timestamp,
			data: this.data,
		};
	}
}

class Room {

    constructor(name) {

		this.name = name
		this.members = []
		this.chats = []
	}

	addClient(client) {
		
        if (!this.memberExist(client.id)) {
			this.members.push(client)
		}
	}

	removeClient(client) {

		let member = this.getClient(client.id)

		if (member) {
			member.disconnect()
		}
	}

	getClient(id) {
		return this.members.find((member) => member.id === id)
	}

	addChat(chat) {
		this.chats.push(chat)
	}

	getChat(sender) {
		return this.chats.filter((chat) => chat.sender === sender)
	}

    memberExist (sender_id) {
        return this.members.some((member) => member.id === sender_id)
    }

	broadcast(io, request) {

        this.members.forEach((member) => {
            
            io.to(member.id).emit("message", {
                sender : request.sender,
                msg : request.msg            
            })
        })
        // this.addChat(new Chat(sender, Date().slice(0,24), msg))
	}

	toJSON() {
		return {
			name: this.name,
			members: this.members.map((m) => m.toJSON()),
			chats: this.chats.map((c) => c.toJSON()),
		}
	}
}

module.exports = { Client, Room, Chat };

/* Developed by Mayank | ( https://github.com/MayankDevil/ ) */