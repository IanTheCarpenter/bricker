const { type } = require('node:os');
const path = require('node:path')



class RouterNode {
    constructor(name='null') {
        this.name = name
        this.handlers = new Map()
        this.children = {};
    }
    addHandler(http_method, handler) {
        this.handlers.set(http_method, handler)
    }
    getHandler(http_method) {
        if (!this.handlers.has(http_method)){
            throw new Error(
                `Method ${http_method} not supported`
            );
        }


        return this.handlers.get(http_method)
    }
}

class Router {
    constructor() {
        this.root = new RouterNode();
    }

    #dirList(route) {
        //verify the path starts with /
        if (route[0] !== "/") {
            throw new Error(`Invalid path: ${route}`)
        }
        
        return path.normalize(route.replace(/\s+/g, ''))
            .split('\\')
            .map(i => {if (i[0] !== ":") {i.toUpperCase()}})
            .filter(i => {return i != ''})
    }

    static verifyHTTPMethod(http_method) {
        if (typeof http_method != "string") {
            throw new Error(
                `Invalid parameter 'http_method': ${http_method} must be of type string`
            );
        }
        if (!["GET","HEAD","POST","PUT","DELETE","CONNECT","OPTIONS","TRACE","PATCH"].includes(http_method.toUpperCase())) {
            throw new Error(
                `Invalid Parameter 'http_method': ${http_method} is not a valid HTTP method`
            )
        }
        return true
    }

    addRoute(route, http_method, handler) {
        if (typeof handler != "function") {
            throw new Error(
                `Invalid parameter 'handler': ${handler} is not of type 'function'`
                );
            }
        http_method = http_method.toUpperCase()
        Router.verifyHTTPMethod(http_method)

        let current = this.root
        let dirs = this.#dirList(route)
        for (const i of dirs) {
            if (!current.children[i]) {current.children[i] = new RouterNode(i)}
            current = current.children[i]
        }
        current.addHandler(http_method, handler)
    }

    getRoute(route, http_method) {
        if (typeof route != "string") {
            throw new Error(
                "Invalid parameter: 'route' must be of type 'string'"
                );
            }
        http_method = http_method.toUpperCase()
        Router.verifyHTTPMethod(http_method)

        let current = this.root
        let dirs = this.#dirList(route)
        console.log(dirs)
        for (const i of dirs) {
            if (current.children.hasOwnProperty(i)) {current = current.children[i]}
            else {return null}
        }



        return current.getHandler(http_method)
    }

    dumpRoutes(node=this.root, indent=0) {
        if (indent > 0) {console.log(`${"-".repeat(indent)}${node.name}`)}
        for (let i in node.children) {
            this.dumpRoutes(node.children[i], indent+1)
        }
    }
}

let fn = function() {console.log("placeholder function")}

let router = new Router()
router.addRoute("/home/residents/john", "POST", fn,)
router.addRoute("/home/residents/john", "connect", fn,)
router.addRoute("/home/residents/jane", "GET", fn,)
router.addRoute("/home/guests/bob", "GET", fn,)
router.addRoute("/home/guests/alice", "GET", fn,)

router.dumpRoutes()

router.getRoute("/home/residents/john", "post")()
router.getRoute("/home/residents/john", "connect")()