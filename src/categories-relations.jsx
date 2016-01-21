var $ = require('jquery');

var React = require('react');
var ReactDOM = require('react-dom');

var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;
var Table = require('react-bootstrap').Table;
var Button = require('react-bootstrap').Button;
var Jumbotron = require('react-bootstrap').Jumbotron;
var Row = require('react-bootstrap').Row;
var Nav = require('react-bootstrap').Nav;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var Input = require('react-bootstrap').Input;

module.exports = React.createClass({
	displayName: 'CategoriesRelations',

	getInitialState: function() {
		return {
			'rowId': 0,
			'toboxCategories': []
		};
	},

    getCategories: function() {
        $.ajax({
            type: "get",
            url: '/tobox/api/beta/categories',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(data){
            	this.setState({
                	'toboxCategories': data
                });
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },

	componentDidMount: function() {
		this.getCategories();
    },

    addRow: function() {
    	var id = this.state.rowId;
        var row = $('<tr id="row-cat-' + id + '"><td id="yml-cat-' + id + '"></td><td id="tobox-cat-' + id + '"></td><td id="delete-button-' + id + '"></td></tr>');
        $("#table-cat").append(row);
		
		
		ReactDOM.render(
			<Input type="text"/>,
			document.getElementById('yml-cat-' + id)
		);

		
		ReactDOM.render(
			<Nav>
				<NavDropdown id={'tobox-nav-cat-' + id} title={window.messages['not_selected']} data-selected='-1'>
					<MenuItem id={-1} key='-1' onClick={this.onCategoryClick} data-row={id}>{window.messages['not_selected']}</MenuItem>
					{this.generateCategoriesView(this.state.toboxCategories, id)}
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

    deleteRow: function(id) {
		var elem = document.getElementById('row-cat-' + id);
		elem.parentNode.removeChild(elem);
	},

	onCategoryClick: function(e) {
		var elem = document.getElementById('tobox-cat-' + e.target.dataset.row);
		var ul = elem.getElementsByTagName('ul');
		if(ul.length > 0) {
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

    render: function() {
    	var table = '';
    	if(this.state.toboxCategories.length != 0) {
    		table = <div>
	    				<Table striped bordered condensed hover>
							<thead>
								<tr>
									<th>User categories</th>
									<th>Tobox categories</th>
									<th></th>
								</tr>
							</thead>
							<tbody id="table-cat">
							</tbody>
						</Table>
						<Button onClick={this.addRow}>Add</Button>
					</div>;
    	}

    	return (
    		<Jumbotron>
				<Row>
		    		<Col xs={10} xsOffset={1}>
						<Panel header='Assign categories to tobox' bsStyle="primary">
							{table}
						</Panel>
					</Col>
				</Row>
			</Jumbotron>
    	);
    }
})