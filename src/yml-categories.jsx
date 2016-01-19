var $ = require('jquery');

var React = require('react');
var ReactDOM = require('react-dom');

var Panel = require('react-bootstrap').Panel;
var Col = require('react-bootstrap').Col;
var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;
var Table = require('react-bootstrap').Table;
var Nav = require('react-bootstrap').Nav;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;

var YmlCategorySelect = require('./yml-category-select');

module.exports = React.createClass({
	displayName: 'YmlCategories',
	getInitialState: function() {
		return {
		     rowId: 0,
			 cats: this.props.data
		};
	},
	
	
	renderRow: function(node) {
		for(var key in node) {
			var cat = node[key];
			if(Object.keys(cat['child']).length === 0) {
				this.addRow();
				this.rowSelect(this.state.rowId, [[cat['id'],cat['title']], '']);
				return;
			}
			this.renderRow(cat['child']);
		}
		
		
		//if(i < len) {
		//	this.addRow();
		//	this.rowSelect(this.state.rowId, [cats[i]['cat_id'], '']);
		//	var self = this;
		//	setTimeout(function() {
		//		i+=1;
		//		self.renderRow(i)
		//	},50)
		//}
		
	},
	
	
	componentDidMount: function() {
		var cats = this.state.cats;
		this.renderRow(cats);
    },
	
	onCategoryClick: function(e) {
		var elem = document.getElementById('tobox-cat-' + e.target.dataset.row);
		var ul = elem.getElementsByTagName('ul');
		if(ul.length>0) {
			ul[0].setAttribute("data-selected", e.target.id);
		}
		var spans = elem.getElementsByTagName('span');
		if(spans.length > 0) {
			spans[0].innerHTML = e.target.text;
		}
	},
	
	onYmlCategoryClick: function(e) {
		var elem = document.getElementById('yml-cat-' + e.target.dataset.row);
		var ul = elem.getElementsByTagName('ul');
		if(ul.length>0) {
			ul[0].setAttribute("data-selected", e.target.id);
		}
		var spans = elem.getElementsByTagName('span');
		if(spans.length > 0) {
			spans[0].innerHTML = e.target.text;
		}
	},
	generateCategoriesView: function(childs, rowId) {
		var result = [];
		for(var i=0; i<childs.length; i++ ) {
			var child = childs[i];
			if(child['child'].length == 0) {
				result.push(
					<MenuItem id={child['id']} key={child['id']} onClick={this.onCategoryClick} data-row={rowId}>{child['title']}</MenuItem>
				);
				return result;
			}	
			result.push(
				<NavDropdown id={child['id']} title={child['title']} key={child['id']} data-row={rowId} >
					{this.generateCategoriesView(child['child'], rowId)}
	    		</NavDropdown>
			);
		}
		return result;
	},
	
	genYmlCategories: function(node, rowId) {
		var result = [];
		for(var key in node) {
			var cat = node[key];
			if(Object.keys(cat['child']).length === 0) {
				result.push(
					<MenuItem id={cat['id']} key={cat['id']} onClick={this.onYmlCategoryClick} data-row={rowId}>{cat['title']}</MenuItem>
				);
				return result;
			}
			
			result.push(
				<NavDropdown id={cat['id']} title={cat['title']} key={cat['id']} data-row={rowId} >
					{this.genYmlCategories(cat['child'], rowId)}
	    		</NavDropdown>
			);
		}
		return result;
	},
	
	
	addRow: function() {
		var id = this.state.rowId;
        var row = $('<tr id="row-cat-' + id + '"><td id="yml-cat-' + id + '"></td><td id="tobox-cat-' + id + '"></td><td id="delete-button-' + id + '"></td></tr>');
        $("#table-cat").append(row);
		
		
		ReactDOM.render(
			<Nav>
				<NavDropdown id={'yml-nav-cat-' + id} title={'not selected'} data-selected='-1'>
					<MenuItem id={-1} key='-1' onClick={this.onCategoryClick} data-row={id}>not selected</MenuItem>
					{this.genYmlCategories(this.state.cats, id)}
				</NavDropdown>
			</Nav>,
			document.getElementById('yml-cat-' + id)
		);

		
		ReactDOM.render(
			<Nav>
				<NavDropdown id={'tobox-nav-cat-' + id} title={'not selected'} data-selected='-1'>
					<MenuItem id={-1} key='-1' onClick={this.onCategoryClick} data-row={id}>not selected</MenuItem>
					{this.generateCategoriesView(window.categories, id)}
				</NavDropdown>
			</Nav>,
			document.getElementById('tobox-cat-' + id)
		);
		
		ReactDOM.render(
			<Button onClick={this.deleteRow.bind(this, id)}>Delete</Button>,
			document.getElementById('delete-button-' + id)
		);
		
		this.state.rowId += 1;
	},
	rowSelect: function(row, data) {
		var elem = document.getElementById('yml-cat-' + (row-1).toString());
		var ul = elem.getElementsByTagName('ul');
		if(ul.length>0) {
			ul[0].setAttribute("data-selected", data[0][0]);
		}
		var spans = elem.getElementsByTagName('span');
		if(spans.length > 0) {
			spans[0].innerHTML = data[0][1];
		}
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