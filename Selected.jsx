Selected = React.createClass({
    render() {
        return (
            <li className={this.props.visible ? '':'hidden'}>
                #{this.props.tag.text}
            </li>
        )
    }
});