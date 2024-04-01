const fs = require('fs')

module.exports =
class DirectoryTree {
    constructor() {

    }

    buildTreeRec() {
        // TODO: this is bad, what if there is no project yet?
        const rootPath = atom.project.getDirectories()[0].path;
        let rootDir = fs.readdirSync(rootPath, {withFileTypes:true});
        let fileList = [];

        let repo = atom.project.getRepositories()[0];
        if (!repo) {
            // TODO: fail or something...
        }

        const nextLevel = (inList, inPath, name) => {
            const tmpDirs = [];
            const tmpFiles = [];

            for (const item of inList) {
                const newPath = inPath+'/'+item.name;
                const isIgnored = repo?.isPathIgnored(newPath.substring(2));
                if (isIgnored) {
                    // let's skip it, don't care about more complicated setups for now.
                    continue;
                }

                if (item.isDirectory()) {
                    const tmpDir = fs.readdirSync(rootPath+'/'+newPath, {withFileTypes:true});
                    tmpDirs.push(nextLevel(tmpDir, newPath, item.name));
                } else {
                    // TODO: what about symlinks and stuff?
                    tmpFiles.push ({name: item.name, repoInfo: repo?.getPathStatus(newPath.substring(2))});
                }
            }

            return {
                name: name,
                dirs: tmpDirs,
                files: tmpFiles
            }
        };

        return nextLevel(rootDir, '.', null);
    }


    buildDirectoryTree() {

        const rootPath = atom.project.getDirectories()[0].path
        let rootDir = fs.readdirSync(rootPath, {withFileTypes:true})
        let fileList = []
        // const genFileList = (inList, inPath) => {
        //     let outList = []
        //     inList.forEach((item, i) => {
        //         if (item.isDirectory()) {
        //             // recursive
        //             const tmpDir = fs.readdirSync(rootPath+'/'+inPath+'/'+item.name, {withFileTypes:true})
        //
        //             const tmpList = genFileList(tmpDir, inPath+'/'+item.name)
        //             // outList.push(inPath+'/'+item.name+'/')
        //             // outList.push(...tmpList)
        //             outList.push({
        //                 dirname: item.name,
        //                 fullname: inPath+'/'+item.name+'/',
        //                 treelist: tmpList
        //             })
        //         } else {
        //             // outList.push(inPath+'/'+item.name)
        //             outList.push({name: item.name, fullname: inPath+'/'+item.name})
        //         }
        //     });
        //     return outList;
        // }
        const genFileListRepo = (inList, inPath, repo) => {
            let outList = []
            inList.forEach((item, i) => {
                const fullname = (inPath+'/'+item.name).substring(2);
                if (item.isDirectory()) {
                    // recursive
                    const tmpDir = fs.readdirSync(rootPath+'/'+inPath+'/'+item.name, {withFileTypes:true})

                    const tmpList = genFileListRepo(tmpDir, inPath+'/'+item.name, repo)
                    // outList.push(inPath+'/'+item.name+'/')
                    // outList.push(...tmpList)
                    outList.push({
                        dirname: item.name,
                        fullname: fullname+'/',
                        treelist: tmpList
                    })
                } else {
                    // outList.push(inPath+'/'+item.name)
                    const isIgnored = repo.isPathIgnored(fullname);
                    if (!isIgnored) {
                        outList.push({name: item.name, fullname: fullname, repoInfo: repo.getPathStatus(fullname)});
                    }
                }
            });
            return outList;
        }
        // TODO: this is crap.
        let repo = atom.project.getRepositories()[0];

        if (repo) {
            // const repoCheck = (testpath) => {
            //     // returns a integer that is used as bit-wise flag storage
            //     // importantly, this is the same on the other side, so we can just send this.
            //     return repo.getPathStatus(testPath);
            //     // const isMod = repo.isPathModified(testPath);
            //     // const isNew = repo.isPathNew(testPath);
            // };
            // fileList = genFileListRepo(rootDir, '.', repo)
            fileList = genFileListRepo(rootDir, '.', repo)
            // fileList = fileList.filter((testPath) => {
            //     // TODO: this does only work for project root...
            //     console.log(`testPath ${testPath.fullname}`);
            //     console.log(`ignored: ${repo.isPathIgnored(testPath.fullname.substring(2))}`);
            //     return !repo.isPathIgnored(testPath.fullname.substring(2));
            // });
        } else {
            // const repoCheck = (foo) => { return 0;};
            // fileList = genFileList(rootDir, '.')
            // TODO: something for non repo stuff..
            fileList = genFileListRepo(rootDir, '.', (_) => 0);
        }
        // fileList = fileList.map((x) => x.substring(2))

        console.log(fileList);

        // this.teletypeService.notifyOnDataChannel({channelName: "tree-view/tree-update", body: JSON.stringify(fileList)})
        return fileList;
    }



}
