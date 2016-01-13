window.YmlCategories = React.createClass({
	getInitialState: function() {
		return {
		     rowId: 0,
		};
	},
	addRow: function() {
		var id = this.state.rowId
        var row = $('<tr id="row-cat-' + id + '"><td id="yml-cat-' + id + '"></td><td id="tobox-cat-' + id + '"></td><td id="delete-button-' + id + '"></td></tr>');
        $("#table-cat").append(row);
		
		ReactDOM.render(
			<Input type="select" placeholder="select">
			  <option value="select">select</option>
			</Input>,
			document.getElementById('yml-cat-' + id)
		);
		
		ReactDOM.render(
			<Input type="select" placeholder="select">
			  <option value="select">select</option>
			</Input>,
			document.getElementById('tobox-cat-' + id)
		);
		
		ReactDOM.render(
			<Button onClick={this.deleteRow.bind(this, id)}>Delete</Button>,
			document.getElementById('delete-button-' + id)
		);
		
		this.state.rowId += 1;
	},
	deleteRow: function(id) {
		var elem = document.getElementById('row-cat-' + id);
		elem.parentNode.removeChild(elem);
	},
	
	render: function() {
		return (
		<Col xs={12}>
			<Panel header='Assign categories from YML'>
				<Table striped bordered condensed hover>
					<thead>
					  <tr>
						<th>Categories in YML</th>
						<th>Catalog Categories</th>
						<th></th>
					  </tr>
					</thead>
					<tbody id="table-cat">
					</tbody>
				</Table>
				<Button onClick={this.addRow}>Add</Button>
			</Panel>
		</Col>
		);
	}
});