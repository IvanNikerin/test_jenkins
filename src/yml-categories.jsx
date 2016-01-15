var $ = require('jquery');

var React = require('react');
var ReactDOM = require('react-dom');

var Panel = require('react-bootstrap').Panel;
var Col = require('react-bootstrap').Col;
var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;
var Table = require('react-bootstrap').Table;

var YmlCategorySelect = require('./yml-category-select');

module.exports = React.createClass({
	displayName: 'YmlCategories',

	getInitialState: function() {
		return {
		     rowId: 0,
			 cats: this.props.data
		};
	},
	componentDidMount: function() {
		var cats = this.state.cats;
		
		for (var i in cats) {
			this.addRow();
			this.rowSelect(this.state.rowId, [cats[i]['cat_id'], '']);
			//console.log(cats[i]);
		}
    },
	addRow: function() {
		var id = this.state.rowId
        var row = $('<tr id="row-cat-' + id + '"><td id="yml-cat-' + id + '"></td><td id="tobox-cat-' + id + '"></td><td id="delete-button-' + id + '"></td></tr>');
        $("#table-cat").append(row);
		
		ReactDOM.render(
			<YmlCategorySelect data={this.state.cats} />,
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
	rowSelect: function(id, data) {
		var elem = document.getElementById('row-cat-' + (id-1).toString());
		var selects = elem.getElementsByTagName('select');
		selects[0].value = data[0];
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