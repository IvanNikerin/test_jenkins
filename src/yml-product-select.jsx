var React = require('react');

var Input = require('react-bootstrap').Input;

module.exports = React.createClass({
	displayName: 'YmlProductSelect',

	render: function() {
		var rows = [];
		var vals = this.props.data;
		for (var id in vals) {
			rows.push(<option key={id} value={vals[id]}>{vals[id]}</option>);
		}
		return (
			<Input className="table-element" type="select" placeholder={window.translate('not_selected')}>
				 <option value="-1">{window.translate('not_selected')}</option>
				{rows}
			</Input>
		);
	}
});