var React = require('react');

var Input = require('react-bootstrap').Input;
var Nav = require('react-bootstrap').Nav;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;

module.exports = React.createClass({
	displayName: 'YmlCategorySelect',
	
	

	//render: function() {
	//	var rows = [];
	//	var cats = this.props.data;
	//	for (var key in cats) {
	//		rows.push(<option key={cats[key]['cat_id']} value={cats[key]['cat_id']}>{cats[key]['cat_name']}</option>);
	//	}
	//	return (
	//		<Input type="select" placeholder="select">
	//			 <option value="">select</option>
	//			{rows}
	//		</Input>
	//	);
	//}
	
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
	
	
	
	render: function() {
		var tmp = this.props.data;
		console.log(tmp);
		return (
			<Nav>
				<NavDropdown id={'tobox-cat-' + id} title={'not selected'} data-selected='-1'>
					<MenuItem id={-1} key='-1' onClick={this.onCategoryClick} data-row={id}>not selected</MenuItem>
					{this.generateCategoriesView(tmp, id)}
				</NavDropdown>
			</Nav>
		);
	}
});