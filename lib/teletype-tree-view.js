'use babel';

import TeletypeDirectoryTreeView from './teletype-directory-tree-view';
import { CompositeDisposable, Disposable } from 'atom';

export default {

  teletypeDirectoryTreeView: null,
  subscriptions: null,

  activate(state) {
    this.teletypeDirectoryTreeView = new TeletypeDirectoryTreeView();

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
    // if (this.teletypeFiles) this.teletypeFiles.setTeletypeService(teletypeService)
  },

  toggle() {
    console.log('TeletypeDirectoryTreeView was toggled!');
    atom.workspace.toggle('atom://teletype-tree-view');
  }

};
