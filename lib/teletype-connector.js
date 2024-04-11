'use babel';

import { CompositeDisposable } from 'atom';

export default class TeletypeConnector {


    constructor(view) {
        // console.log("I am new TeletypeConnector");
        // console.log(teletypeService);
        this.view = view;
        this.view.setupRequestHostFileCallback(
            (filename) => {this.requestHostToOpenFile(filename)}
        );

        this.subs = new CompositeDisposable();

        // this.loginLookup = new Map();
    }

    setTeletypeService(teletypeService) {
        this.teletypeService = teletypeService
    }

    sendProjectTree(tree) {
        // TODO: service could be undefined
        this.teletypeService?.notifyOnDataChannel({channelName: "tree-view/tree-update", body: JSON.stringify(tree)})
    }

    requestHostToOpenFile(filename) {
        if (!this.teletypeService) return;
        // would you kindly share this file with us
        this.teletypeService.notifyOnDataChannel({
            channelName: 'tree-view/kindly-open',
            body: JSON.stringify({ filename: filename })
        })
        // would you kindly tell us how we can reach the new file
        console.log("debug get remoteEditors");
        let reply = async (filename) => {
            // lets try at most 3 times, because... why not?
            for (let i = 0; i < 13; i++) {
                // wait a bit, it is only polite to give them a little time to think
                await new Promise(r => setTimeout(r, 200*(1+i)));

                // look, I know, this part would be cleaner with an ack from host,
                // I will fix it if it fails frequently in practive,
                // so far seems to just be more complicated for no good reason -.-

                const remoteEditors = (this.teletypeService && await this.teletypeService.getRemoteEditors()) || []
                const remoteItems = remoteEditors.map((remoteEditor) => {
                    return {
                        uri: remoteEditor.uri,
                        filePath: remoteEditor.path,
                        label: `@${remoteEditor.hostGitHubUsername}: ${remoteEditor.path}`,
                        ownerGitHubUsername: remoteEditor.hostGitHubUsername
                    }
                })
                const needleRemoteItem = remoteItems.filter((item) => {
                    // TODO: this needs fixing if I ever fix the paths...
                    console.log(item.filePath.substring(item.filePath.indexOf('/')+1));
                    console.log(filename);
                    return item.filePath.substring(item.filePath.indexOf('/')+1) === filename;
                })
                console.log(remoteItems);
                console.log(needleRemoteItem);
                if (needleRemoteItem.length == 1) {
                    return needleRemoteItem[0];
                }
            }
            // TODO: we failed
            throw new Error("no such file, maybe host refused our request.")
        }
        reply(filename).then((remoteFile) => {
            // if we got an answer, we can just open it,
            console.log(remoteFile);
            // TODO: make it fancy...
            // damn it, yesterday I thought: "I never remember what I meant by that, better write something else." And now it is true...
            // maybe I meant the options for open(), not open new pane or something.
            console.log(`trying to open ${remoteFile.uri}`);
            if (remoteFile.uri) {
                atom.workspace.open(remoteFile.uri)
            }
        });
        // const  this.teletypeService.getRemoteEditors()
    }


    subscribeToDataChannels() {
        // TODO: this never works: there is no data channel ready when starting.
        //       best to fix this inside teletype, make nicer API.
        // TODO: disposeable needs work...
        // let channelDisposeable =
        this.teletypeService.subscribeToDataChannel(
            {
                channelName: 'tree-view/tree-update',
                callback: (body) => {
                    // this.updateTeletypeTree(JSON.parse(body.body.toString()))
                    const tree = JSON.parse(body.body.toString())
                    console.log("GOT THIS TREE:");
                    console.log(tree);
                    delete tree.name;
                    this.view.render(tree)
                }
            }).then((channelDisposeable) => {
                console.log("channelDisposeable:");
                console.log(channelDisposeable);
                if (channelDisposeable) {
                    this.subs.add(
                        channelDisposeable
                    )
                }
            });

        console.log("trying to subscribe to host data channel.");
        this.teletypeService.subscribeToHostDataChannel(
            {
                channelName: 'tree-view/kindly-open',
                callback: (body) => {
                    const filenameToOpen = JSON.parse(body.body.toString()).filename;
                    // TODO: ask the user if really want to open
                    //       just do it for now...
                    console.log(`guest requested to open ${filenameToOpen}`);
                    // TODO: sanitize filename, check against repo, only allow not-ignored files, etc...
                    atom.workspace.open(filenameToOpen)
                    // atom.workspace.open(uri, options)
                }
            }).then((channelDisposeable) => {
                console.log("channelDisposeable:");
                console.log(channelDisposeable);
                if (channelDisposeable) {
                    this.subs.add(
                        channelDisposeable
                    )
                }
            });
    }

};
