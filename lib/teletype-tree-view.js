'use babel';

import TeletypeDirectoryTreeView from './teletype-directory-tree-view';
import TeletypeConnector from './teletype-connector';
import DirectoryTree from './directory-tree';
import { CompositeDisposable, Disposable } from 'atom';

export default {

  teletypeDirectoryTreeView: null,
  subscriptions: null,

  activate(state) {
    this.teletypeDirectoryTreeView = new TeletypeDirectoryTreeView();
    this.directoryTree = new DirectoryTree();
    // TODO: TESTING
    // console.log(this.directoryTree.buildDirectoryTree());
    console.log("-----------------------");
    const foo = this.directoryTree.buildTreeRec();
    console.log(foo);
    delete foo.name;
    this.teletypeDirectoryTreeView.render(foo);
    // TODO -- end testing..

    this.teletypeConnector = new TeletypeConnector(this.teletypeDirectoryTreeView);

    this.subscriptions = new CompositeDisposable(
        // Add an opener for our view.
        atom.workspace.addOpener(uri => {
          if (uri === 'atom://teletype-tree-view') {
            return this.teletypeDirectoryTreeView;
          }
        }),

        // Register command that toggles this view
        atom.commands.add('atom-workspace', {
          'teletype-tree-view:toggle': () => this.toggle()
        }),

        // Destroy any TeletypeChatView when the package is deactivated.
        new Disposable(() => {
          atom.workspace.getPaneItems().forEach(item => {
            if (item instanceof TeletypeDirectoryTreeView) {
              item.destroy();
            }
          });
        })
      );

  },

  deactivate() {
    // this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.teletypeDirectoryTreeView.destroy();
  },

  // serialize() {
  //   return {
  //     teletypeTreeViewViewState: this.teletypeTreeViewView.serialize()
  //   };
  // },

  consumeTeletype (teletypeService) {
    this.teletypeService = teletypeService
    // TODO: check is stupid, either always works, then it is useless
    // or it masks error for it to fail later..
    if (this.teletypeConnector) this.teletypeConnector.setTeletypeService(teletypeService)
  },

  toggle() {
    console.log('TeletypeDirectoryTreeView was toggled!');
    atom.workspace.toggle('atom://teletype-tree-view');
  }

};
