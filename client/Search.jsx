import React from "react";

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
            this.search(this.state.searchString, 'search');
        }
    },

    search: function (string, action) {
        document.querySelector('#popular').style.display = "none";
        if (document.querySelector('#saved')) document.querySelector('#saved').style.display = "none";
        ga('send', 'event', 'Search', action, string);
        this.setState({tags: [], loading: true});
        this.props.toggleLoading(true);
        var _this = this; // so that we can set state after Meteor's async call
        Meteor.call('search', string, function (error, result) {
            if (error) {
                console.error(error);
                Notifications.error(error);
                return;
            }
            _this.props.toggleLoading(false);
            if (Array.isArray(result)) _this.setState({tags: result, loading: false})
            else if (result.message) {
                _this.setState({tags: result.tags, loading: false})
                Notifications.success(result.message, '', {userCloseable: false, timeout: 10000});
            }

            setTimeout(function () {
                $('.tag > input').mousedown(function () {
                    $(this).parent().addClass('mousedown');
                });
                $('.tag > input').mouseup(function () {
                    $(this).parent().removeClass('mousedown');
                });
                $('.tag > input').longpress(function () {
                    Notifications.success("Great! You've chained a search", '', {userCloseable: false, timeout: 3000});
                    _this.setState({searchString: $(this).parent().text().replace('#', '')});
                    _this.search($(this).parent().text().replace('#', ''), 'longpress');
                });
            }, 1000);
        });
    },

    renderTags() {
        return this.state.tags.map((tag) => {
            return <Tag tag={tag} addTag={this.props.addTag} removeTag={this.props.removeTag}/>;
        });
    },

    renderSavedTagsWrapper(){
        if (localStorage.getItem('savedTags')) return (
            <div className="row" id="saved">
                <h5>Your Recent Tags</h5>
                {this.renderSavedTags(JSON.parse(localStorage.getItem('savedTags')))}
            </div>
        )
        else return false
    },

    renderSavedTags(savedTags){
        return savedTags.map((savedTag) => {
            return <div>{savedTag}</div>
        })
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
                <div className={this.state.loading ? 'hidden' : 'tag-wrapper' }>
                    {this.renderTags()}
                </div>
                {this.renderSavedTagsWrapper()}
                <Popular search={this.search}/>
            </div>
        );
    }
});
