function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _extends() {_extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};return _extends.apply(this, arguments);}const Component = React.Component;
const Fragment = React.Fragment;

const types = {
  ERROR: 'error',
  UPDATING: 'updating',
  SUCCESS: 'success' };


const messages = {
  UPDATING_MESSAGE: '⚠️ Creating your custom message. This will update once complete.',
  STATUS_FAILED:
  '🚫 Oh no! Looks like the link was blocked by a pop-up blocker. Activate portals to fix.',
  SUCCESS_MESSAGE: '✅ Your message was created successfully' };


/**
                                                                 * -------------------------------------------------------
                                                                 * Input
                                                                 * -------------------------------------------------------
                                                                 *
                                                                 */

const Input = ({ tag: Tag = 'input', label, value, onChange, ...rest }) =>
React.createElement(Fragment, null,
React.createElement("label", null, label),
React.createElement(Tag, _extends({
  onChange: ({ currentTarget: { value } }) => {
    onChange(value);
  },
  value: value || '' },
rest)));





/**
          * -------------------------------------------------------
          * Loading
          * -------------------------------------------------------
          *
          */

const Loading = () =>
React.createElement("div", { className: "loading" },
React.createElement("div", { className: "progress" }));



/**
                                                         * -------------------------------------------------------
                                                         * Status
                                                         * -------------------------------------------------------
                                                         *
                                                         */

const Status = ({ status: { message, type } }) => React.createElement("p", { className: `status ${type}` }, message);

/**
                                                                                                                       * -------------------------------------------------------
                                                                                                                       * Window Portal
                                                                                                                       * -------------------------------------------------------
                                                                                                                       *
                                                                                                                       */

const WindowPortal = ({ children, el }) => ReactDOM.createPortal(children, el);

/**
                                                                                 * -------------------------------------------------------
                                                                                 * Messenger
                                                                                 * -------------------------------------------------------
                                                                                 *
                                                                                 */

class Messenger extends Component {constructor(...args) {super(...args);_defineProperty(this, "state",
    {
      messages: [],
      usePortal: false });_defineProperty(this, "handleSave",


    ({ name, message }) => {
      const { messages } = this.state;
      const id = messages.length;
      // set some defaults for lazy people
      const newMessage = {
        name: name || 'Anonymous',
        message: message || '¯\\_(ツ)_/¯',
        id };

      const newMessages = [...messages, newMessage];
      this.setState({ messages: newMessages });
    });}

  render() {
    const { messages, usePortal } = this.state;
    const hasSavedMessages = !!messages.length;
    return (
      React.createElement("article", { className: "container" },
      React.createElement("h1", null, "Messenger \uD83D\uDCDD"),
      React.createElement("div", { className: "form card" },
      React.createElement(MessageCreator, { handleSave: this.handleSave }),
      React.createElement(SavedMessages, { messages: messages, usePortal: usePortal })),

      React.createElement("button", {
        className: "portal-toggle btn",
        onClick: () => this.setState(({ usePortal }) => ({ usePortal: !usePortal })) },
      usePortal ? 'Disable Portal' : 'Activate Portal')));



  }}


/**
      * -------------------------------------------------------
      * Message Creator
      * -------------------------------------------------------
      *
      */

class MessageCreator extends Component {constructor(...args) {super(...args);_defineProperty(this, "state",
    {
      name: null,
      message: null });}


  render() {
    const { message, name } = this.state;
    const { handleSave } = this.props;
    return (
      React.createElement(Fragment, null,
      React.createElement(Input, {
        label: "Your Name",
        value: name,
        placeholder: "Anonymous",
        onChange: (name) =>
        this.setState({
          name }) }),



      React.createElement(Input, {
        label: "Your Message",
        value: message,
        placeholder: "Lorem ipsum",
        onChange: message => this.setState({ message }),
        tag: "textarea" }),

      React.createElement("button", {
        className: "btn",
        onClick: () => {
          handleSave({ name, message });
          this.setState({ name: null, message: null });
        } }, "Save Message")));




  }}


/**
      * -------------------------------------------------------
      * Message Listing
      * -------------------------------------------------------
      *
      */

const MessageListing = ({ name, id, handleSubmit, children }) =>
React.createElement("div", { className: "saved-message-container" },
React.createElement("button", { className: "saved-message", onClick: () => handleSubmit(id) }, "\uD83D\uDD17 ",
name),

children);



/**
            * -------------------------------------------------------
            * Saved Messages
            * -------------------------------------------------------
            *
            */

const SavedMessages = ({ messages, usePortal }) => {
  const hasSavedMessages = Boolean(messages.length);
  return (
    React.createElement(Fragment, null,
    hasSavedMessages && React.createElement("h2", null, "Saved Messages"),
    React.createElement("div", { className: "saved-messages" },
    hasSavedMessages &&
    messages.map((message) =>
    React.createElement(SavedMessage, { key: message.id, message: message, usePortal: usePortal })))));




};

/**
    * -------------------------------------------------------
    * Saved Message
    * -------------------------------------------------------
    *
    */

class SavedMessage extends Component {constructor(...args) {super(...args);_defineProperty(this, "state",
    {
      isPortalOpen: false,
      status: null });_defineProperty(this, "handleSubmit",






    id => {
      const { usePortal } = this.props;

      // open the portal and show a status message
      this.setState({
        status: {
          type: types.UPDATING,
          message: messages.UPDATING_MESSAGE },

        isPortalOpen: usePortal });


      // if we are using the portal, open immediately.
      if (usePortal) this.handleOpenPortal();

      // Fake async action that returns some markup once it's been "uploaded"
      // What this is really meant to simulate is an action that uploads some
      // markup to a webserver then returns the URL of that document.
      const { message } = this.props;

      createHtml(message).
      then(markup => {
        this.setState({
          isPortalOpen: usePortal,
          status: {
            type: types.SUCCESS,
            message: messages.SUCCESS_MESSAGE },

          markup });

        // Can't do this because it will be blocked by a pop-up blocker.
        // event context is lost in the async createHtml action, thus won't
        // be a "trusted" user initiated event. We should open the portal first.

        // So, if not using the portal, open once the work is complete
        // In the real world we'd instead open the link to the HTML
        // but we still need to open one to fake opening a URL
        if (!usePortal) this.handleOpenPortal();
      }).
      catch(error => {
        this.setState({ status: { type: types.ERROR, message: error.message } });
      });
    });_defineProperty(this, "handleOpenPortal",

    () => {
      const { id } = this.props;

      // close any alreay opened windows
      if (this.portalWindow) this.portalWindow.close();

      // this is to demonstrate if called after the async function it won't open.
      // catch to display the error to the user.
      try {
        this.portalWindow = window.open('', `_blank`);
        const { document: portalDoc } = this.portalWindow.window;

        // copy source doc styles to portal window
        copyStyles(window.document, portalDoc);

        // Portal element we will render into
        this.portalEl = portalDoc.createElement('div');
        this.portalEl.id = 'root';
        portalDoc.body.appendChild(this.portalEl);
      } catch (error) {
        this.setState({
          status: {
            type: types.ERROR,
            message: messages.STATUS_FAILED } });


      }
    });}componentWillReceiveProps({ usePortal }) {if (usePortal !== this.props.usePortal) this.setState({ status: null, isPortalOpen: false });}

  render() {
    const { id, name } = this.props.message;
    const { status, isPortalOpen, markup } = this.state;

    return (
      React.createElement(Fragment, null,
      React.createElement(MessageListing, { id: id, name: name, handleSubmit: this.handleSubmit },

      status &&
      React.createElement(Fragment, null,
      React.createElement(Status, { status: status }),
      status.type === types.UPDATING && React.createElement(Loading, null))),




      isPortalOpen &&
      React.createElement(WindowPortal, { el: this.portalEl },
      React.createElement(Fragment, null,
      status.type === types.SUCCESS &&
      // in reality markup is hosted as an HTML doc on a server,
      // but since this is for demo purposes just pretend we'd set
      // the location to the new updated url instead of writing the html
      this.portalWindow.window.document.write(markup),
      status.type === types.UPDATING &&
      React.createElement("article", { className: "container" },
      React.createElement("div", { className: "card" },
      React.createElement(Status, { status: status }),
      React.createElement(Loading, null)))))));








  }}



/**
      * -------------------------------------------------------
      * Actions
      * -------------------------------------------------------
      *
      */

async function createHtml(message) {
  const markup = await uploadMarkup(message);

  return new Promise((resolve, reject) => {
    resolve(markup);
  });
}

// Fake API call that "uploads" markup to a server.
// Really it just returns the markup here for us to use.

function uploadMarkup({ name, message }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`<!DOCTYPE html>
                <html>
                <head>
                <title>${name}</title>
                ${createStyles()}
                </head>
                <body>
                    <h1>${name} says:</h1>
                    <p>${message}</p>
                </body>
                </html>`);
    }, 2000);
  });
}

function createStyles() {
  return `<style>
        html,
        body {
            height: 100%;
        }

        * {
            box-sizing: border-box;
        }

        h1 {
            width: 100%;
            font-weight: 100;
        }

        p {
            width: 100%;
            margin: 0;
            line-height: 1;
            font-size: 4vw;
            font-weight: 700;
            color: #222;
        }

        p:after,
        p:before {
            color: #222;
        }

        p:before {
            content: '“';
            margin-right: 0.2em;
        }

        p:after {
            content: '”';
            margin-left: 0.2em;
        }

        body {
            height: 100%;            
            position: relative;
            color: #222;
            background-image: linear-gradient(90deg, #fbff8c 0%, #ffeb8c 100%);
            text-align: center;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            display: flex;
            align-items: center;
            align-content: center;
            flex-flow: row wrap;
        }
    </style>`;
}

/**
   * -------------------------------------------------------
   * Copy Styles
   * -------------------------------------------------------
   *
   */

function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
    let hasRules = false;
    try {
      hasRules = Boolean(styleSheet.cssRules);
    } catch (e) {
      console.log(e);
    }

    if (hasRules) {
      // for <style> elements
      const newStyleEl = sourceDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach(cssRule => {
        // write the text of each rule into the body of the style element
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = sourceDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

/**
   * -------------------------------------------------------
   * App
   * -------------------------------------------------------
   *
   */

const App = () =>
React.createElement("main", null,
React.createElement(Messenger, null));



const run = () => {
  const root = document.getElementById('root');
  ReactDOM.render(React.createElement(App, null), root);
};

run();