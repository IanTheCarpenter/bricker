const path = require('node:path')



class RouterNode {
    constructor(name='null') {
        this.dirs = null;
        this.name = name;
        this.handlers = new Map();
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

    getRoute(url, http_method) {
        if (typeof url != "string") {
            throw new Error(
                "Invalid parameter: 'route' must be of type 'string'"
                );
            }
        http_method = http_method.toUpperCase()
        Router.verifyHTTPMethod(http_method)

        let current = this.root
        let url_dirs = this.#generateDirsList(url)
        console.log(`getRoute called: ${url}, ${http_method}`)
        console.log(`  url_dirs: ${url_dirs}`)
        console.log(`  beginning loop:`)
        console.log()
        for (const i of url_dirs) {
            let children_keys = Object.keys(current.children)
            console.log(`    children of current node ${current.name}: ${children_keys}`)
            
            //dynamic route:
            if (children_keys[0][0] == ":") {
                current = current.children[children_keys[0]];
                console.log(`    dynamic route found: ${current.name}`)
            }
            //static route
            else if (current.children.hasOwnProperty(i)) {
                current = current.children[i];
                console.log(`    static route found: ${current.name}`)
            }
            else {return null}
            console.log()
        }

        console.log(`getRoute:`)
        console.log(`  current node name: ${current.name}`)
        console.log(`  current node path: ${current.dirs}`)
        console.log(`  current URL: ${url_dirs}`)

        return {func: current.getHandler(http_method), params: this.#generateParams(current.dirs, url_dirs)}
    }

    dumpRoutes(node=this.root, indent=0) {
        if (indent > 0) {console.log(`${"-".repeat(indent)}${node.name}`)}
        for (let i in node.children) {
            this.dumpRoutes(node.children[i], indent+1)
        }
    }
}

