/**
 * Created by Timothy on 10/18/15.
 */


React = (typeof module !== 'undefined' && module.exports) ? require('react/addons') : window.React

var Header = React.createClass({
    render: function() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <a href="#" className="brand-logo center">Message Board</a>
                </div>
            </nav>)
    }
})



var Footer = React.createClass({
    render: function () {
        return (
            <footer className="page-footer">
                <div className="footer-copyright">
                    <div className="container">
                        The React.js Course by Azat(<a href="https://twitter.com/azat_co" target="_blank">@azat_co</a>)
                    </div>
                </div>
            </footer>
        )
    }
})

var NewMessage = React.createClass({
    addMessage: function(){
        var fD = React.findDOMNode
        this.props.addMessageCb({
            name: fD(this.refs.name).value,
            message: fD(this.refs.message).value
        })
        fD(this.refs.name).value = ''
        fD(this.refs.message).value = ''
    },
    keyup: function(e) {
        if (e.keyCode == 13) return this.addMessage()
    },
    render: function () {
        return (
            <div className="row" id="new-message">
                <form onKeyUp={this.keyup}>
                    <div className="input-field col s4">
                        <i className="material-icons prefix">account_circle</i>
                        <input id="icon_prefix" type="text" name="name" className="validate" ref="name"/>
                        <label htmlFor="icon_prefix">Name</label>
                    </div>
                    <div className="input-field col s12">
                        <i className="material-icons prefix">mode_edit</i>
                        <textarea id="icon_prefix2" name="message" className="materialize-textarea" ref="message"></textarea>
                        <label htmlFor="icon_prefix2">Message</label>
                    </div>
                    <div className="col s4">
                        <a id="send" onClick={this.addMessage}>
                            <button className="btn waves-effect waves-light">Submit
                                <i className="material-icons right">send</i>
                            </button>
                        </a>
                    </div>
                </form>
            </div>
        )
    }
})

var MessageList = React.createClass({
    render: function() {
        var messages = this.props.messages
        if (!messages.length>0) return (
            <tr>
                <td colspan="2">No messages yet</td>
            </tr>
        )
        return (
            <table className="striped">
                <caption>Messages</caption>
                <thead>
                    <tr>
                        <th className="col s2">Name</th>
                        <th className="col s10">Message</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map(function (message) {
                        return (
                            <tr key={message._id}>
                                <td className="col s2">{message.name}</td>
                                <td className="col s10">{message.message}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        )
    }
})

var MessageBoard = React.createClass({
    getInitialState: function (ops) {
        if (this.props.messages) return {messages: this.props.messages}
    },
    componentDidMount: function () {
        var url = "http://localhost:5000/messages"
        var _this = this
        $.getJSON(url, function (result) {
            if(!result || !result.length)
                return
            _this.setState({messages: result})
        })
    },
    addMessage: function (message) {
        var messages = this.state.messages
        var _this = this
        $.post( 'http://localhost:5000/messages', message, function(data) {
            if(!data) {
                return console.log("Failed to POST")
            }
            messages.unshift(data)
            _this.setState({messages: messages})
        })
    },
    render: function () {
        return (
            <div>
                <NewMessage messages={this.state.messages} addMessageCb={this.addMessage} />
                <MessageList messages={this.state.messages} />
            </div>
        )
    }
})

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Header: Header,
        Footer: Footer,
        MessageBoard: MessageBoard
    }
} else {
    React.render(<Header />, document.getElementById('header'))
    React.render(<Footer />, document.getElementById('footer'))
    React.render(<MessageBoard messages={messages}/>, document.getElementById('message-board'))
}