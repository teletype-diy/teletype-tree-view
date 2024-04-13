
module.exports =
class ShareHostFileDialog {
  constructor ({config, commandRegistry, workspace}) {
    this.commandRegistry = commandRegistry
    this.workspace = workspace
    this.confirm = this.confirm.bind(this)
    this.cancel = this.cancel.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    // this.props = {uri: ''}
    // // etch.initialize(this)

    this.element = document.createElement("div")
    // this.element.textContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    this.init()

    this.disposables = this.commandRegistry.add(this.element, {
        'core:confirm': this.confirm,
        'core:cancel': this.cancel
    })
  }

  init () {
    this.element.classList.add('padded');
    let button_always_allow = document.createElement('button');
    // button_always_allow.classList.add('padded');
    button_always_allow.textContent = "Always allow peers to open project files";

    // TODO: this may include which client was it.
    const foo = `
        <div class="padded">
            peer PEERID asked to open FILEID
        </div>
        <div class="block padded">
            <button data-setting="ask" class="btn btn-primary inline-block-tight">Allow once, ask again</button>
            <button data-setting="allow-session" class="btn inline-block-tight">Allow for this session</button>
            <button data-setting="always" class="btn inline-block-tight">Allow Always</button>
            <button data-setting="deny" class="btn inline-block-tight">Deny request</button>
        </div>
    `;

    // this.element.appendChild(button_always_allow);
    this.element.innerHTML = foo;

    this.element.getElementsByTagName('button')[0].addEventListener("click", ()=> {
        console.log("clicked ask again");
    })
    this.element.getElementsByTagName('button')[1].addEventListener("click", ()=> {
        console.log("clicked allow for session");
    })
    this.element.getElementsByTagName('button')[2].addEventListener("click", ()=> {
        console.log("clicked allow always");
    })
    this.element.getElementsByTagName('button')[3].addEventListener("click", ()=> {
        console.log("clicked deny");
    })
  }

  destroy () {
    if (this.panel) this.panel.destroy()

    this.disposables.dispose()
    // etch.destroy(this)
  }

  async show (uri) {
    // await this.update({uri})

    // This dialog could be opened before Atom's workaround for window focus is
    // triggered (see https://git.io/vxWDa), so we delay focusing it to prevent
    // such workaround from stealing focus from the dialog.
    await timeout(5)

    // We explicitly add the modal as hidden because of a bug in the auto-focus
    // feature that prevents it from working correctly when using visible: true.
    this.panel = this.workspace.addModalPanel({item: this.render(), visible: false, autoFocus: true})
    this.panel.show()
    this.element.focus()
    this.element.addEventListener('blur', this.handleBlur)

    return new Promise((resolve) => {
      this.resolveWithExitStatus = resolve
      this.panel.onDidDestroy(() => {
        this.panel = null
        this.element.removeEventListener('blur', this.handleBlur)
      })
    })
  }

  confirm () {
    const whichBtn = document.activeElement?.dataset.setting;
    console.log(whichBtn);

    switch (whichBtn) {
        case "ask":
            this.allowOnce();
            break;
        case "allow-session":
            this.allowSession();
            break;
        case "always":
            this.allowAlways();
            break;
        case "deny":
            // this.denyOnce();
            this.cancel();
            break;
        default:
            console.warn("no button focused.");
    }
  }

  allowOnce () {
    this.resolveWithExitStatus(this.constructor.EXIT_STATUS.ALLOW_ONCE)
    this.panel.destroy()
  }

  allowSession () {
    this.resolveWithExitStatus(this.constructor.EXIT_STATUS.ALLOW_SESSION)
    this.panel.destroy()
  }

  allowAlways () {
    this.resolveWithExitStatus(this.constructor.EXIT_STATUS.ALLOW_ALWAYS)
    this.panel.destroy()
  }

  cancel () {
    this.resolveWithExitStatus(this.constructor.EXIT_STATUS.CANCEL)
    this.panel.destroy()
  }

  render () {

    return this.element;
    // return $.div({className: 'JoinViaExternalAppDialog', tabIndex: -1},
    //   $.div(null,
    //     $.h1(null, 'Join this portal?'),
    //     $.a({className: 'JoinViaExternalAppDialog-cancel icon icon-x', onClick: this.cancel})
    //   ),
    //   $.p({className: 'JoinViaExternalAppDialog-uri'}, this.props.uri),
    //   $.p(null, 'By joining this portal, the other collaborators will see your GitHub username, your avatar, and any edits that you perform inside the portal.'),
    //   $.footer({className: 'JoinViaExternalAppDialog-footer'},
    //     $.label({className: 'input-label'},
    //       $.input({
    //         ref: 'joinWithoutAskingCheckbox',
    //         className: 'input-checkbox',
    //         type: 'checkbox'
    //       }),
    //       $.span(null, 'Always join without asking. I only open URLs from people I trust.')
    //     ),
    //     $.button(
    //       {className: 'btn btn-lg btn-primary', onClick: this.confirm},
    //       'Join portal'
    //     )
    //   )
    // )
  }

  // update (props) {
  //   this.props = props
  //   return etch.update(this)
  // }

  writeAfterUpdate () {
    this.refs.joinWithoutAskingCheckbox.checked = false
  }

  handleBlur (event) {
    if (document.hasFocus() && !this.element.contains(event.relatedTarget)) {
      this.cancel()
    }
  }
}

module.exports.EXIT_STATUS = {
  ALLOW_ALWAYS: 0,
  ALLOW_SESSION: 1,
  ALLOW_ONCE: 2,
  CANCEL: 3
}

function timeout (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
