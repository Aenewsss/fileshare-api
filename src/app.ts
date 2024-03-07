import express, { Application } from "express"
import { config } from "dotenv"
config()


class AppController {

    express: Application

    constructor() {
        this.express = express()
        this.middlewares()
        this.routes()
    }

    middlewares(){
        this.express.use(express.json())
    }

    routes(){
        // this.express.use()
    }
}

export default new AppController().express