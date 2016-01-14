window.YmlCategorySelect = React.createClass({
	render: function() {
		var rows = [];
		var cats = this.props.data;
		for (var key in cats) {
			rows.push(<option key={cats[key]['cat_id']} value={cats[key]['cat_id']}>{cats[key]['cat_name']}</option>);
		}
		return (
			<Input type="select" placeholder="select">
				 <option value="">select</option>
				{rows}
			</Input>
		);
	}
});