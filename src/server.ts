import { config } from "dotenv"
config()
import { createServer } from "http"
import { environments } from "./environments";
import { Server } from "socket.io";
import { ISession } from "./interfaces";

const server = createServer()
const PORT = environments.PORT || 3022

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", async (socket) => {
    console.log('socket connected', socket.id)

    socket.on("receiver-join", (data) => {
        const session = io.sockets.adapter.rooms.has(data)

        if (!session) socket.emit("receiver-join-error")
        else {
            socket.join(data)
            socket.emit("receiver-join-success")

            const numbersOfConnections = io.sockets.adapter.rooms.get(data)?.size
            socket.in(data).emit("receiver-join-session", numbersOfConnections)
        }
    })

    socket.on("sender-join", (data: string) => {
        socket.join(data)
    })

    socket.on("file-meta", (data: { sessionId: string, metadata: any }) => {
        socket.in(data.sessionId).emit("fs-meta", data.metadata)
    })
    socket.on("fs-start", (data: string) => {
        socket.in(data).emit("fs-share", {})
    })
    socket.on("file-raw", (data: { sessionId: string, buffer: any }) => {
        socket.in(data.sessionId).emit("fs-share", data.buffer)
    })

    socket.on("disconnect", (reason) => {
        console.log(`session: ${socket.id} disconnected`)
    })
})

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))