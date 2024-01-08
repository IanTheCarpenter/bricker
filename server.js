const { Router } = require('./router');
const http = require('node:http')
let PORT = 10905

class Server {

    constructor(port) {
        this.PORT = port;
        this.#router_init()

        this.listener = http.createServer((request, response) => this.handle(request, response))
        this.listener.listen(PORT)
    }
    #router_init() {
        // this.router = Router.fromJson();
        this.router = new Router();
        this.router.addRoute("/", "get", function(request, response) {return response.end("i am root")})
        this.router.addRoute("/pootis/\:victim", "get", function(request, response, params) {return response.end(`HOOVY WEAPONS KILLS ${params.victim}`)})

    }
    
    /**
     * @param {string} message
     * Responds with error code 404. A custom message can be supplied
     */

    handle(request, response) {
        const {url, method} = request
        
        //retrieve the function from the router
        this.router.getRoute(request, response)
        // // generate response???
        // return handler.func(request, response)
    }
}

let server = new Server()