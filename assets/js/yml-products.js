window.YmlProducts = React.createClass({
	getInitialState: function() {
		return {
		    rowId: 0,
			prod_struct: this.props.data
		};
	},
	componentDidMount: function() {
		var attrs = this.state.prod_struct['attrs'];
		var params = this.state.prod_struct['params']
		
		for (var i in attrs) {
			this.addRow('prod-attr');
			this.rowSelect(this.state.rowId, [attrs[i],''], 'prod-attr');
		}
		for (var j in params) {
			this.addRow('prod-param');
			this.rowSelect(this.state.rowId, [params[j],''], 'prod-param');
		}
    },
	addRow: function(tableName) {
		var pid = this.state.rowId
        var row = $('<tr id="row-'+ tableName + pid + '"><td id="yml-'+ tableName + pid + '"></td><td id="tobox-'+ tableName + pid + '"></td><td id="delete-button-'+ tableName + pid + '"></td></tr>');
        $("#" + tableName).append(row);
		
		ReactDOM.render(
			<YmlProductSelect data={tableName=='prod-attr' ? this.state.prod_struct['attrs'] : this.state.prod_struct['params']} />,
			document.getElementById('yml-'+ tableName + pid)
		);
		
		ReactDOM.render(
			<ToboxProductAttributesSelect />,
			document.getElementById('tobox-'+ tableName + pid)
		);
		
		ReactDOM.render(
			<Button onClick={this.deleteRow.bind(this, pid, tableName)}>Delete</Button>,
			document.getElementById('delete-button-'+ tableName + pid)
		);
		
		this.state.rowId += 1;
	},
	rowSelect: function(id, data, tableName) {
		var elem = document.getElementById('row-'+ tableName + (id-1).toString());
		var selects = elem.getElementsByTagName('select');
		selects[0].value = data[0];
	},
	deleteRow: function(pid, tableName) {
		var elem = document.getElementById('row-'+ tableName + pid);
		elem.parentNode.removeChild(elem);
	},
	
	render: function() {
		return (
		<Col xs={12}>
			<Panel header='Assign product attributes from YML'>
				<Table striped bordered condensed hover>
					<thead>
					  <tr>
						<th>Attribute name in YML</th>
						<th>Product Attribute</th>
						<th></th>
					  </tr>
					</thead>
					<tbody id="prod-attr">
					</tbody>
				</Table>
				<Button onClick={this.addRow.bind(this, 'prod-attr')} class='uberbrn'>Add</Button>
			</Panel>
			<Panel header='Assign product params from YML'>
				<Table striped bordered condensed hover>
					<thead>
					  <tr>
						<th>Param name in YML</th>
						<th>Product Attribute</th>
						<th></th>
					  </tr>
					</thead>
					<tbody id="prod-param">
					</tbody>
				</Table>
				<Button onClick={this.addRow.bind(this, 'prod-param')}>Add</Button>
			</Panel>
		</Col>
		);
	}
});