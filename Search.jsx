Search = React.createClass({

    getInitialState: function () {
        var tags =
            [
                //{_id: 1, text: "foo", score: 25},
                //{_id: 2, text: "boo", score: 10},
                //{_id: 3, text: "yoo", score: 5},
            ];
        return {
            searchString: '',
            tags: tags,
            loading: false
        };
    },

    handleChange: function (e) {
        var searchString = e.target.value.replace('#', '').replace(' ', '');
        this.setState({searchString: searchString});
    },

    handleClick: function () {
        this.setState({searchString: ''});
    },

    handleSubmit: function (e) {
        if (e) e.preventDefault();
        if (this.state.searchString) {
            ga('send', 'event', 'Search', 'Search', this.state.searchString);
            this.setState({tags: [], loading: true});
            this.props.toggleLoading(true);
            var _this = this; // so that we can set state after Meteor's async call
            Meteor.call('search', this.state.searchString, function (error, result) {
                if (error) {
                    console.error(error);
                    Notifications.error(error);
                    return;
                }
                _this.setState({tags: result, loading: false});
                _this.props.toggleLoading(false);
                setTimeout(function () {
                    $('.tag > input').mousedown(function () {
                        $(this).parent().addClass('mousedown');
                    });
                    $('.tag > input').mouseup(function () {
                        $(this).parent().removeClass('mousedown');
                    });
                    $('.tag > input').longpress(function () {
                        _this.setState({searchString: $(this).parent().text().replace('#', '')});
                        _this.handleSubmit();
                    });
                }, 1000);
            });
        }
    },

    renderTags() {
        return this.state.tags.map((tag) => {
            return <Tag key={tag._id} tag={tag} addTag={this.props.addTag} removeTag={this.props.removeTag}/>;
        });
    },

    resetState: function () {
        this.replaceState(this.getInitialState());
    },

    render: function () {
        return (
            <div>
                <form id="search-form" onSubmit={this.handleSubmit} ref="form">
                    <input id="search" type="text" onClick={this.handleClick} value={this.state.searchString}
                           onChange={this.handleChange}
                           placeholder="hashtag" ref="input"/>
                </form>
                <div className={this.state.loading ? 'hidden':'tag-wrapper' }>
                    {this.renderTags()}
                </div>
            </div>
        );
    }
});
