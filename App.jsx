// App component - represents the whole app
App = React.createClass({

    getInitialState: function () {
        new Clipboard('.btn');
        return {
            count: 0,
            tagsInText: '@IQta.gs #IQtags',
            loading: false
        }
    },

    toggleLoading: function (state) {
        if (typeof state !== 'undefined') {
            this.setState({loading: state});
        }
        else {
            this.setState({loading: !this.state.loading});
        }
    },

    addTag: function (text) {
        if (this.state.count === 0) {
            jQuery('.buttons-wrapper').fadeIn(500);
        }
        var tagsInText = (this.state.tagsInText + ' #' + text).trim();
        tagsInText = tagsInText.split(' ').shuffle().join(' '); // shuffle tags around so it becomes harder to remove default tags
        this.setState({count: ++this.state.count, tagsInText: tagsInText});
        selectedTags.push(text);
    },

    removeTag: function (text) {
        var tagsInText = '';
        if (this.state.count === 1) {
            tagsInText = '@IQta.gs #IQtags';
            jQuery('.buttons-wrapper').fadeOut(500);
        }
        else {
            tagsInText = this.state.tagsInText.replace('#' + text + ' ', '');
            if (tagsInText.endsWith('#' + text)) {
                tagsInText = tagsInText.substring(0, tagsInText.length - text.length - 2);
            }
        }
        this.setState({count: --this.state.count, tagsInText: tagsInText});
        var index = selectedTags.indexOf(text);
        if (index > -1) {
            selectedTags.splice(index, 1);
        }
    },

    resetState: function () {
        this.replaceState(this.getInitialState());
        selectedTags = [];
    },

    resetApp: function () {
        this.resetState();
        this.refs.search.resetState();
        jQuery('.buttons-wrapper').fadeOut(500);
    },

    renderCopyButton: function () {
        return (
            <div className="buttons-wrapper">
                <div className="count">
                    Selected: {this.state.count}
                </div>
                <button className="btn copy show-mobile"
                        data-clipboard-target="#tags">
                    Copy to clipboard
                </button>
                <button className="btn copy show-desktop"
                        data-clipboard-text={this.state.tagsInText}>
                    Copy to clipboard
                </button>
                <button className="btn start-again" onClick={this.resetApp}>Start again</button>
            </div>
        )
    },

    renderTextarea: function () {
        if (!this.state.loading) {
            return <textarea
                className={this.state.count > 0 ? 'u-full-width show-mobile' : 'u-full-width show-mobile hidden'}
                id="tags"
                value={this.state.tagsInText}></textarea>;
        }
        else return;
    },

    renderloading() {
        if (this.state.loading) {
            return <div className="loader"></div>;
        }
        else return;
    },

    render() {
        return (
            <div className="container">
                <div className="row">
                    <header>
                        <h1>IQta.gs</h1>

                        <h2>Hashtag suggestions for Instagram</h2>
                    </header>
                </div>
                <div className="row">
                    {this.renderCopyButton()}
                </div>
                <div className="row">
                    <div className="search">
                        <Search toggleLoading={this.toggleLoading} addTag={this.addTag}
                                removeTag={this.removeTag}
                                resetState={this.resetState} ref={'search'}/>
                    </div>
                </div>
                {this.renderTextarea()}
                {this.renderloading()}
            </div>
        );
    }
});

Array.prototype.shuffle = function () {
    var i = this.length;
    if (i == 0) return this;
    while (--i) {
        var j = Math.floor(Math.random() * (i + 1 ));
        var a = this[i];
        var b = this[j];
        this[i] = b;
        this[j] = a;
    }
    return this;
};
