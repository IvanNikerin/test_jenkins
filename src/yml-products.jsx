var $ = require('jquery');

var React = require('react');
var ReactDOM = require('react-dom');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;
var Table = require('react-bootstrap').Table;

var ToboxProductAttributesSelect = require('./tobox-product-attributes-select');
var YmlProductSelect = require('./yml-product-select');

module.exports = React.createClass({
	displayName: 'YmlProducts',

	getInitialState: function() {
		return {
		    rowId: 0,
			prod_struct: this.props.data
		};
	},
	componentDidMount: function() {
		var attrs = this.state.prod_struct['attrs'];
		var params = this.state.prod_struct['params'];
		if(!('rels' in this.state.prod_struct)) {
			for (var i in attrs) {
				this.addRow('prod-attr');
				this.rowSelect(this.state.rowId, [attrs[i],'',false], 'prod-attr');
			}
			for (var j in params) {
				this.addRow('prod-param');
				this.rowSelect(this.state.rowId, [params[j],'',false], 'prod-param');
			}
		} else {
			var attrs_rels = this.state.prod_struct['attrs-rels'];
			var params_rels = this.state.prod_struct['params-rels'];
			for (var i in attrs_rels) {
				this.addRow('prod-attr');
				this.rowSelect(this.state.rowId, [attrs_rels[i]['yml'],attrs_rels[i]['tobox'],attrs_rels[i]['autoupdate']], 'prod-attr');
			}
			for (var j in params_rels) {
				this.addRow('prod-param');
				this.rowSelect(this.state.rowId, [params_rels[j]['yml'],params_rels[j]['tobox'],params_rels[j]['autoupdate']], 'prod-param');
			}
		}
    },
	addRow: function(tableName) {
		var pid = this.state.rowId
        var row = $('<tr id="row-'+ tableName + pid + '"><td class="col-xs-4" id="yml-'+ tableName + pid + '"></td><td id="tobox-'+ tableName + pid + '"></td><td class="text-center" id="autoupdate-'+ tableName + pid +'"><input class="table-checkbox" type="checkbox" value=""></td><td id="delete-button-'+ tableName + pid + '" class="table-delete-col text-center"></td></tr>');
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
			<Button className="table-element" bsStyle="danger" onClick={this.deleteRow.bind(this, pid, tableName)}>Delete</Button>,
			document.getElementById('delete-button-'+ tableName + pid)
		);
		
		this.state.rowId += 1;
	},
	rowSelect: function(id, data, tableName) {
		var elem = document.getElementById('row-'+ tableName + (id-1).toString());
		var selects = elem.getElementsByTagName('select');
		if(selects.length > 1) {
			selects[0].value = data[0];
			if(data[1] != '') {
				selects[1].value = data[1];
			}
		}
		var inputs = elem.getElementsByTagName('input');
		if(inputs.length > 0) {
			inputs[0].checked = data[2];
		}
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
						<th className="col-xs-4">Attribute name in YML</th>
						<th>Product Attribute</th>
						<th className="col-xs-1">Autoupdate</th>
						<th className="table-delete-col"></th>
					  </tr>
					</thead>
					<tbody id="prod-attr">
					</tbody>
				</Table>
				<Button className="pull-right add-button" bsStyle="success" onClick={this.addRow.bind(this, 'prod-attr')} >Add</Button>
			</Panel>
			<Panel header='Assign product params from YML'>
				<Table striped bordered condensed hover>
					<thead>
					  <tr>
						<th className="col-xs-4">Param name in YML</th>
						<th>Product Attribute</th>
						<th className="col-xs-1">Autoupdate</th>
						<th className="table-delete-col"></th>
					  </tr>
					</thead>
					<tbody id="prod-param">
					</tbody>
				</Table>
				<Button className="pull-right add-button" bsStyle="success" onClick={this.addRow.bind(this, 'prod-param')} >Add</Button>
			</Panel>
		</Col>
		);
	}
});