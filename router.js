const path = require('node:path')



class RouterNode {
    constructor(name='null') {
        this.dirs = [];
        this.name = name;
        this.handlers = new Map();
        this.children = {};
    }
    addHandler(http_method, handler) {
        this.handlers.set(http_method, handler)
    }
    getHandler(http_method) {
        if (!this.handlers.has(http_method)){
            return false
            }
        else {
            return this.handlers.get(http_method)
        }
    }
}

class Router {
    constructor(notFound) {
        this.root = new RouterNode();
        this.notFoundMessage = notFound
    }
    
    #notFound(response) {
        response.writeHead(404)

        // default 404 page
        response.end(this.notFoundMessage)
    }

    #generateDirsList(route) {
        //verify the path starts with /
        if (route[0] !== "/") {
            throw new Error(`Invalid path: ${route}`)
        }
        
        let list = path.normalize(route.replace(/\s+/g, ''))
        list = list.split('\\')
        list.map(i => {if (i[0] !== ":") {i.toLowerCase()}})
        list = list.filter(i => {return i != ''})
        return list
    }
    
    #generateParams(dirs, url) {

        let params = {};
        
        for (let i=0; i<dirs.length; i++ ) {
            if (dirs[i][0] === ":") {
                params[`${dirs[i].substring(1)}`] = url[i]
            }
        }
        return params
    }
    
    static fromJson(routes_json) {
        let router = new Router();
        Object.keys(routes_json).forEach(key => {
            switch(key) {
                case "handler":
                    key.forEach(route =>{
                        router.addRoute(routes_json[route])
                    })
            }
            
        });
        return router
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
        let dirs = this.#generateDirsList(route)
        for (const i of dirs) {
            if (i[0] == ":" && Object.keys(current.children).length < 0) {
                throw new Error(
                    `Invalid route: cannot add dynamic route in non-empty directory`
                )
            }

            if (!current.children[i]) {current.children[i] = new RouterNode(i)}
            current = current.children[i]
        }
        current.dirs = dirs
        current.addHandler(http_method, handler)
    }

    getRoute(request, response) {
        const {url, method} = request
        let current = this.root
        let url_dirs = this.#generateDirsList(url)
        
        for (const i of url_dirs) {
            let children_keys = Object.keys(current.children)
            
            //dynamic route:
            if (children_keys[0][0] == ":") {
                current = current.children[children_keys[0]];
            }
            //static route
            else if (current.children.hasOwnProperty(i)) {
                current = current.children[i];
            }
            else {
                this.#notFound(response)
                return
            }
        }
        // check if the current has any handler
        if (current.getHandler(method)) {
            current.getHandler(method)(request, response, this.#generateParams(current.dirs, url_dirs)) 
        }
        else{
            this.#notFound(response)
        }
    }


    dumpRoutes(node=this.root, indent=0) {
        if (indent > 0) {console.log(`${"-".repeat(indent)}${node.name}`)}
        for (let i in node.children) {
            this.dumpRoutes(node.children[i], indent+1)
        }
    }
}

module.exports = {Router}
