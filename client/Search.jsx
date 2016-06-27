import React from 'react'

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

    popular: function (string) {
        this.search(string, 'popular');
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
                <div className={this.state.loading ? 'hidden':'tag-wrapper' }>
                    {this.renderTags()}
                </div>
                {this.renderSavedTagsWrapper()}
                <div className="row" id="popular">
                    <h5>Popular Searches</h5>

                    <div className="tag">
                        <input type="checkbox" onClick={this.popular.bind(this, 'food')}/>
                        <label for="" className="noselect">#food</label>
                        <i className="fa fa-plus"></i>
                        <i className="fa fa-check"></i>
                    </div>
                    <div className="tag">
                        <input type="checkbox" onClick={this.popular.bind(this, 'fashion')}/>
                        <label for="" className="noselect">#fashion</label>
                        <i className="fa fa-plus"></i>
                        <i className="fa fa-check"></i>
                    </div>
                    <div className="tag">
                        <input type="checkbox" onClick={this.popular.bind(this, 'art')}/>
                        <label for="" className="noselect">#art</label>
                        <i className="fa fa-plus"></i>
                        <i className="fa fa-check"></i>
                    </div>
                    <div className="tag">
                        <input type="checkbox" onClick={this.popular.bind(this, 'travel')}/>
                        <label for="" className="noselect">#travel</label>
                        <i className="fa fa-plus"></i>
                        <i className="fa fa-check"></i>
                    </div>
                    <div className="tag">
                        <input type="checkbox" onClick={this.popular.bind(this, 'paris')}/>
                        <label for="" className="noselect">#paris</label>
                        <i className="fa fa-plus"></i>
                        <i className="fa fa-check"></i>
                    </div>
                    <div className="tag">
                        <input type="checkbox" onClick={this.popular.bind(this, 'love')}/>
                        <label for="" className="noselect">#love</label>
                        <i className="fa fa-plus"></i>
                        <i className="fa fa-check"></i>
                    </div>
                    <div className="tag" onClick={this.popular.bind(this, 'photo')}>
                        <input type="checkbox"/>
                        <label for="" className="noselect">#photo</label>
                        <i className="fa fa-plus"></i>
                        <i className="fa fa-check"></i>
                    </div>
                    <div className="tag" onClick={this.popular.bind(this, 'sport')}>
                        <input type="checkbox"/>
                        <label for="" className="noselect">#sport</label>
                        <i className="fa fa-plus"></i>
                        <i className="fa fa-check"></i>
                    </div>
                    <div className="tag" onClick={this.popular.bind(this, 'coffee')}>
                        <input type="checkbox"/>
                        <label for="" className="noselect">#coffee</label>
                        <i className="fa fa-plus"></i>
                        <i className="fa fa-check"></i>
                    </div>
                    <div className="tag" onClick={this.popular.bind(this, 'nature')}>
                        <input type="checkbox"/>
                        <label for="" className="noselect">#nature</label>
                        <i className="fa fa-plus"></i>
                        <i className="fa fa-check"></i>
                    </div>
                </div>
            </div>
        );
    }
});
