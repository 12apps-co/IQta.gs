import React from 'react'

// App component - represents the whole app
Popular = React.createClass({

    getInitialState: function () {
        return {tags: []}
    },

    componentWillMount: function () {
        if (window.location.pathname.indexOf('kor') > -1) {
            setTimeout(()=> {
                this.setState({tags: popularTags.kor})
            }, 3000)
        }
        else {
            setTimeout(()=> {
                this.setState({tags: popularTags.eng})
            }, 3000)
        }
    },

    popular: function (string) {
        this.props.search(string, 'popular');
    },

    renderTags: function () {
        return this.state.tags.map((tag) => {
            return (
                <div className="tag">
                    <input type="checkbox" onClick={this.popular.bind(this, tag.hashtag)}/>
                    <label for="" className="noselect">#{tag.hashtag}</label>
                    <i className="fa fa-plus"></i>
                    <i className="fa fa-check"></i>
                </div>
            )
        });
    },

    render: function () {
        return (
            <div className="row" id="popular">
                <h5 className={this.state.tags.length > 0 ? '' :'hidden'}>Popular Hashtags</h5>
                <div className={this.state.tags.length > 0 ? '' :'loader' }>
                    {this.renderTags()}
                </div>
            </div>
        )
    }
})