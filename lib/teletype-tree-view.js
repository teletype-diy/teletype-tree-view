'use babel';

import TeletypeTreeViewView from './teletype-tree-view-view';
import { CompositeDisposable } from 'atom';

export default {

  teletypeTreeViewView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.teletypeTreeViewView = new TeletypeTreeViewView(state.teletypeTreeViewViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.teletypeTreeViewView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'teletype-tree-view:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.teletypeTreeViewView.destroy();
  },

  serialize() {
    return {
      teletypeTreeViewViewState: this.teletypeTreeViewView.serialize()
    };
  },

  toggle() {
    console.log('TeletypeTreeView was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
