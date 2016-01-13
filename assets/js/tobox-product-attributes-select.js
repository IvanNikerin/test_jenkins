window.ToboxProductAttributesSelect = React.createClass({
	render: function() {
		var rows = [];
		for (var key in window.products) {
			rows.push(<option key={key} value={window.products[key]}>{key}</option>);
		}
		return (
			<Input type="select" placeholder="select">
				 <option value="">select</option>
				{rows}
			</Input>
		);
	}
});