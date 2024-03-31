
module.exports =
class TeletypeDirectoryTreeView {
    // This class can render a remote teletype directory tree.

    constructor() {
        this.selectedEntries = [];

        this.element = document.createElement('div');
        this.render();
    }


    getTitle() {
        // Used by Atom for tab text
        return 'Teletype Tree View';
    }

    getURI() {
        // Used by Atom to identify the view when toggling.
        return 'atom://teletype-tree-view';
    }

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    getDefaultLocation() {
        // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
        // Valid values are "left", "right", "bottom", and "center" (the default).
        return 'right';
    }


    deselect(deselectList) {
        deselectList.forEach((item, i) => {
            item.classList.remove('selected');
            const index = this.selectedEntries.indexOf(item);
            this.selectedEntries.splice(index, 1);
        });
    }

    select(item) {
        this.deselect(this.selectedEntries);
        if (!(item in this.selectedEntries)) {
            this.selectedEntries.push(item);
            item.classList.add('selected');
        }
    }

    toggleExpand(e) {
      e.stopPropagation();
      // atom.workspace.paneForItem(item).destroyItem(item)
      // let target = e.target;
      // let target = e.currentTarget;
      let target = e.currentTarget.parentElement;
      console.log("trying to toggle folder");
      if (target.classList.contains("expanded")) {
          target.classList.remove('expanded')
          target.classList.add('collapsed')
      } else {
          target.classList.remove('collapsed')
          target.classList.add('expanded')
      }
      console.log(this);
      this.select(target);
      // console.log(this.selectedEntries);
      // target.classList.add('selected')
    }

    // select

    render() {
        // TODO: TESTING
        const repo = this.renderRepo(
            {
                dirs: [
                        {
                            name:'test',
                            dirs:[],
                            files: ['hello_world']
                        }
                      ],
                files: ['foobar']}
        );


        this.element.appendChild(repo);
    }


    renderRepo(tree) {
        const repoDiv = document.createElement('div');
        // repoDiv.classList.add('padded');

        const repo = document.createElement('ul');
        repo.classList.add('list-tree');
        repo.classList.add('has-collapsable-children');

        const rest = this.renderDir(tree);

        repo.appendChild(rest);
        repoDiv.appendChild(repo);
        return repoDiv;
    }


    renderDir(tree) {
        // TODO: TESTING
        // const isRoot = !('name' in tree)
        // const dir_name = (isRoot) ? "Teletype Project" : tree.name;
        const isRoot = !('name' in tree)
        const dir_name = (isRoot) ? "Teletype Project" : tree.name;

        // const dir = document.createElement('ul');
        // dir.classList.add('list-tree');
        // if (isRoot) dir.classList.add('has-collapsable-children');

        const li_dir = document.createElement('li');
        li_dir.classList.add('list-nested-item');
        // dir.appendChild(li_dir);

        const div_dir_item = document.createElement('div');
        div_dir_item.classList.add('list-item');
        div_dir_item.addEventListener('click', (e) => {this.toggleExpand(e)});
        li_dir.appendChild(div_dir_item);

        const span_dir_item = document.createElement('span');
        span_dir_item.classList.add('icon', (isRoot) ? 'icon-repo' : 'icon-file-directory');
        span_dir_item.textContent = dir_name;
        div_dir_item.appendChild(span_dir_item);

        const content_container = document.createElement('ul');
        content_container.classList.add('list-tree');
        li_dir.appendChild(content_container);

        // render all dirs
        // TODO: sort by name
        for (const tmpDir of tree.dirs) {
            const tmp = this.renderDir(tmpDir);
            content_container.appendChild(tmp);
        }
        // const rest = this.renderDir(tree);
        // li_dir.appendChild(rest);

        // render all files
        for (const tmpFile of tree.files) {
            const tmp = this.renderFile(tmpFile);
            content_container.appendChild(tmp);
        }

        // TODO: recursive walk through dir and do files
        // return dir;
        return li_dir;
    }


    renderFile(file) {
        const li_file = document.createElement('li');
        li_file.classList.add('list-item');

        const span_file = document.createElement('span');
        // TODO: do file type stuff
        span_file.classList.add('icon', 'icon-file-text');
        span_file.textContent = file;

        li_file.appendChild(span_file);
        return li_file;
    }

    // renderDir(tree) {
    //     // TODO: TESTING
    //     const dir_name = "foobar";
    //
    //     const dir = document.createElement('ul');
    //     dir.classList.add('list-tree');
    //
    //     const li_dir = document.createElement('li');
    //     li_dir.classList.add('list-nested-item');
    //     dir.appendChild(li_dir);
    //
    //     const div_dir_item = document.createElement('div');
    //     div_dir_item.classList.add('list-item');
    //     li_dir.appendChild(div_dir_item);
    //
    //     const span_dir_item = document.createElement('span');
    //     span_dir_item.classList.add('icon', 'icon-file-directory');
    //     span_dir_item.textContent = dir_name;
    //     div_dir_item.appendChild(span_dir_item);
    //
    //     // TODO: recursive walk through dir and do files
    //     return dir;
    // }

}