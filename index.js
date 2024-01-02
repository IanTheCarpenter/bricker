const http = require('node:http')
const PORT = 10905;

const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
    HEAD: "HEAD",
    OPTIONS: "OPTIONS",
    CONNECT: "CONNECT",
    TRACE: "TRACE",
};

class Router {
    constructor () {
        this.routes = {};
    }
    #addRoute(method, path, handler) {
        if (typeof path !== "string" || typeof handler !== "function") {
            throw new Error("invalid argument types: path must be string and handler must be a function")
        }
        this.routes[`${method} ${path}`] = handler
    }

    get(path, handler) {
        this.#addRoute(HTTP_METHODS.GET, path, handler)
    }
    post(path, handler) {
        this.#addRoute(HTTP_METHODS.POST, path, handler)
    }
    put(path, handler) {
        this.#addRoute(HTTP_METHODS.PUT, path, handler)
    }
    delete(path, handler) {
        this.#addRoute(HTTP_METHODS.DELETE, path, handler)
    }
    patch(path, handler) {
        this.#addRoute(HTTP_METHODS.PATCH, path, handler)
    }
    head(path, handler) {
        this.#addRoute(HTTP_METHODS.HEAD, path, handler)
    }
    options(path, handler) {
        this.#addRoute(HTTP_METHODS.OPTIONS, path, handler)
    }
    connect(path, handler) {
        this.#addRoute(HTTP_METHODS.CONNECT, path, handler)
    }
    trace(path, handler) {
        this.#addRoute(HTTP_METHODS.TRACE, path, handler)
    }



    dumpRoutes() {
        console.log(Object.entries(this.routes));
    }

    handleRequest(request, response) {
        const {url, method} = request
        const handler = this.routes[`${method} ${url}`]

        // check for invalid route

        if (!handler) {
            response.writeHead(404, {'Content-Type': 'text/plain'})
            return response.end('not found')
        }
        handler(request, response)
    }
}

const router = new Router();

router.get('/', function handleGetRoot(request, response) {
    console.log(`GET called on /`); response.end()
});
router.post('/', function handlePostRoot(request, response) {
    console.log(`POST called on /`); response.end()
});
router.get('/test/', function handleGetTest(request, response) {
    console.log(`GET called on /test/`); response.end()
});
router.post('/test/', function handlePostTest(request, response) {
    console.log(`POST called on /test/`); response.end()
});

let server = http.createServer((request, response) => router.handleRequest(request, response));

server.listen(PORT)