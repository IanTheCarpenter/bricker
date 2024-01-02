const { default: test } = require("node:test");

class TrieNode {
    constructor(char=null) {
        this.char = char
        this.endOfWord = false
        this.children = {};
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode;
    }

    insert(string) {
        let current = this.root
        for (const i of string) {
            if (!current.children[i]) {current.children[i] = new TrieNode(i)}
            current = current.children[i]
        }
        current.endOfWord = true
    }

    search(string) {
        let current = this.root
        for (const char of string) {
            if (current.children.hasOwnProperty(char)) {current = current.children[char]}
            else {return false}
        }
        if (current.endOfWord) {return true}
        else {return false}
    }

    dumpStrings() {
        const recurse = function(node, currentString='') {
            if (node.char) {currentString = currentString + node.char}
            if (node.endOfWord) {console.log(currentString)}
            for (let i in node.children) {recurse(node.children[i], currentString)}
        }
        recurse(this.root)
    }
}
const testTrie = new Trie()

testTrie.insert("pootis")
testTrie.insert("pie")
testTrie.insert("pied")
testTrie.dumpStrings()
console.log(testTrie.search(""))
// console.log(JSON.stringify(testTrie.root.children))
