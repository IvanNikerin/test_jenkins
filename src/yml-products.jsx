var $ = require('jquery');

var React = require('react');
var ReactDOM = require('react-dom');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;
var Table = require('react-bootstrap').Table;

var ToboxProductAttributesSelect = require('./tobox-product-attributes-select');

module.exports = React.createClass({
	displayName: 'YmlProducts',

	getInitialState: function() {
		return {
		     rowId: 0,
		};
	},
	addRow: function(tableName) {
		var pid = this.state.rowId
        var row = $('<tr id="row-'+ tableName + pid + '"><td id="yml-'+ tableName + pid + '"></td><td id="tobox-'+ tableName + pid + '"></td><td id="delete-button-'+ tableName + pid + '"></td></tr>');
        $("#" + tableName).append(row);
		
		ReactDOM.render(
			<Input type="select" placeholder="select">
			  <option value="select">select</option>
			</Input>,
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