var React = require('react');

var Input = require('react-bootstrap').Input;

module.exports = React.createClass({
	displayName: 'ToboxProductAttributesSelect',

	render: function() {
		var rows = [];
		for (var key in window.products) {
			rows.push(<option key={key} value={window.products[key]}>{key}</option>);
		}
		return (
			<Input type="select" placeholder={window.messages['not_selected']}>
				 <option value="-1">{window.messages['not_selected']}</option>
				 <option value={window.tobox_uuid['value']}>{window.tobox_uuid['name']}</option>
				{rows}
			</Input>
		);
	}
});