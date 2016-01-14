window.YmlProductSelect = React.createClass({
	render: function() {
		var rows = [];
		var vals = this.props.data;
		for (var id in vals) {
			rows.push(<option key={id} value={vals[id]}>{vals[id]}</option>);
		}
		return (
			<Input type="select" placeholder="select">
				 <option value="">select</option>
				{rows}
			</Input>
		);
	}
});