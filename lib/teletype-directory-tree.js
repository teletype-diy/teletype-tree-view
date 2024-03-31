
module.exports =
class TeletypeDirectoryTree {
    // This class can render a remote teletype directory tree.

    constructor() {
        // misuse a object as tree
        // map of map would work too, but needs more work to serialize to JSON
        this.tree = {}
        // TODO: remove sample tree
        const foo = {
            name: 'folder1',
            dirs: [],
            files: ["file1", "file2"]
        }
        this.tree = {
                dirs: [foo],
                files: ["hello_world", "testfile"]
            }
    }

    // TODO: not done, also sucks..
    #recursiveDeleteBranches(tree, diff) {
        for (const [key, newDiff] of Object.entries(diff)) {

            if (Object.hasOwn(tree, key)) {
                const newTree = tree[key];


                if (typeof key === 'string') {
                    // we are a leaf, delete tree entry

                }

            }
            console.log(`${key}: ${value}`);
        }
    }


    // TODO: updateTree sucks. facts. I only have bad ideas to fix it. try again later.
    // updates the internal tree.
    // op can be: update or delete
    // update does insert if not exists and override if it does
    // diff is the part of the tree that's effected by the operation
    updateTree ({op, diff}) {
        if (op === 'update') {
            // TODO: this is wrong..
            this.tree = Object.assign(this.tree, diff)
        } else if (op === 'delete') {
            for (const [key, value] of Object.entries(diff)) {
                console.log(`${key}: ${value}`);
            }
        }
    }
}
