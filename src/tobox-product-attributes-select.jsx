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
			<Input className="table-element" type="select" placeholder={window.translate('not_selected')}>
				 <option value="-1">{window.translate('not_selected')}</option>
				 <option value={window.tobox_uuid['value']}>{window.tobox_uuid['name']}</option>
				{rows}
			</Input>
		);
	}
});