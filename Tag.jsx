Tag = React.createClass({
    getInitialState: function () {
        var isTrue = selectedTags.includes(this.props.tag.text);
        return {
            selected: isTrue
        }
    },
    handleClick: function () {
        if (selectedTags.length === 28 && !this.state.selected) {
            $('.copy').addClass('highlight');
        }
        if (selectedTags.length === 4 && !this.state.selected) {
            Notifications.success('Great! Select up to 29 tags', '', {userCloseable: false, timeout: 2000});
        }
        if (selectedTags.length === 9 && !this.state.selected) {
            Notifications.success('Try pressing a tag for 3 seconds! :)', '', {userCloseable: false, timeout: 3000});
        }
        if (selectedTags.length < 29) {
            if (!this.state.selected) {
                this.props.addTag(this.props.tag.text);
            }
            else {
                this.props.removeTag(this.props.tag.text);
            }
            this.setState({selected: !this.state.selected});
        }
        else if (!this.state.selected) {
            Notifications.success('Maximum number of tags selected', '', {userCloseable: false, timeout: 2000});
        }
        else {
            this.props.removeTag(this.props.tag.text);
            this.setState({selected: !this.state.selected});
        }
    },

    render() {
        return (
            <div className="tag">
                <input type="checkbox" checked={this.state.selected} onClick={this.handleClick}/>
                <label for="" className="noselect">#{this.props.tag.text}</label>
                <i className="fa fa-plus"></i>
                <i className="fa fa-check"></i>
            </div>
        )
    }
});