/**
 * Created by Timothy on 10/18/15.
 */


React = (typeof module !== 'undefined' && module.exports) ? require('react/addons') : window.React

var Header = React.createClass({displayName: "Header",
    render: function() {
        return (
            React.createElement("nav", null, 
                React.createElement("div", {className: "nav-wrapper"}, 
                    React.createElement("a", {href: "#", className: "brand-logo center"}, "Message Board")
                )
            ))
    }
})



var Footer = React.createClass({displayName: "Footer",
    render: function () {
        return (
            React.createElement("footer", {className: "page-footer"}, 
                React.createElement("div", {className: "footer-copyright"}, 
                    React.createElement("div", {className: "container"}, 
                        "The React.js Course by Azat(", React.createElement("a", {href: "https://twitter.com/azat_co", target: "_blank"}, "@azat_co"), ")"
                    )
                )
            )
        )
    }
})

var NewMessage = React.createClass({displayName: "NewMessage",
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
            React.createElement("div", {className: "row", id: "new-message"}, 
                React.createElement("form", {onKeyUp: this.keyup}, 
                    React.createElement("div", {className: "input-field col s4"}, 
                        React.createElement("i", {className: "material-icons prefix"}, "account_circle"), 
                        React.createElement("input", {id: "icon_prefix", type: "text", name: "name", className: "validate", ref: "name"}), 
                        React.createElement("label", {htmlFor: "icon_prefix"}, "Name")
                    ), 
                    React.createElement("div", {className: "input-field col s12"}, 
                        React.createElement("i", {className: "material-icons prefix"}, "mode_edit"), 
                        React.createElement("textarea", {id: "icon_prefix2", name: "message", className: "materialize-textarea", ref: "message"}), 
                        React.createElement("label", {htmlFor: "icon_prefix2"}, "Message")
                    ), 
                    React.createElement("div", {className: "col s4"}, 
                        React.createElement("a", {id: "send", onClick: this.addMessage}, 
                            React.createElement("button", {className: "btn waves-effect waves-light"}, "Submit", 
                                React.createElement("i", {className: "material-icons right"}, "send")
                            )
                        )
                    )
                )
            )
        )
    }
})

var MessageList = React.createClass({displayName: "MessageList",
    render: function() {
        var messages = this.props.messages
        if (!messages.length>0) return (
            React.createElement("tr", null, 
                React.createElement("td", {colspan: "2"}, "No messages yet")
            )
        )
        return (
            React.createElement("table", {className: "striped"}, 
                React.createElement("caption", null, "Messages"), 
                React.createElement("thead", null, 
                    React.createElement("tr", null, 
                        React.createElement("th", {className: "col s2"}, "Name"), 
                        React.createElement("th", {className: "col s10"}, "Message")
                    )
                ), 
                React.createElement("tbody", null, 
                    messages.map(function (message) {
                        return (
                            React.createElement("tr", {key: message._id}, 
                                React.createElement("td", {className: "col s2"}, message.name), 
                                React.createElement("td", {className: "col s10"}, message.message)
                            )
                        )
                    })
                )
            )

        )
    }
})

var MessageBoard = React.createClass({displayName: "MessageBoard",
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
            React.createElement("div", null, 
                React.createElement(NewMessage, {messages: this.state.messages, addMessageCb: this.addMessage}), 
                React.createElement(MessageList, {messages: this.state.messages})
            )
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
    React.render(React.createElement(Header, null), document.getElementById('header'))
    React.render(React.createElement(Footer, null), document.getElementById('footer'))
    React.render(React.createElement(MessageBoard, {messages: messages}), document.getElementById('message-board'))
}