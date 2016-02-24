var $ = require('jquery');
require('jquery.cookie');

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
var Well = require('react-bootstrap').Well;

module.exports = React.createClass({
	displayName: 'CategoriesRelations',

	getInitialState: function() {
		return {
			'rowId': 0,
			'toboxCategories': [],
			'categoriesRelations': {},
			'userId': this.props.userId,
			'errorNeedHide': true,
		};
	},

	viewError: function(msg) {
		ReactDOM.render(
   			<Panel header={<h3>Configure data</h3>} bsStyle="danger">
      			<Row>
					<Col xs={12}>
						{msg}
					</Col>
				</Row>
    		</Panel>,
			document.getElementById('categories-relations-problem')
		);
	},

	showError : function(msg) {
		var self = this;
		this.viewError(msg, 'Warning');
		if(this.state.errorNeedHide) {
			setTimeout(function() {
				self.setState({errorNeedHide:true});
				self.hideError();
			}, 5000);
		}
		this.setState({errorNeedHide:false});
	},

	hideError: function() {
		ReactDOM.render(
			<div></div>,
			document.getElementById('categories-relations-problem')
		);
	},

	clearLog: function() {
		$.ajax({
	    	type: 'post',
	    	url: '/importer/api/tasks/',
	    	data: {user_id: this.state.userId}
   		});
	},

	getCategories: function(toboxCategories) {
		$.ajax({
            type: "get",
            url: '/importer/api/tobox/relations/category/',
            contentType: 'application/json',
            dataType: 'json',
            data: {user_id: this.state.userId, token: $.cookie('toboxkey')},
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(data){
				var relations = {};
				if('relation_json' in data) {
					if(data['relation_json']) {
						relations = JSON.parse(data['relation_json']);
					}
				}
            	this.setState({
                	'toboxCategories': toboxCategories,
                	'categoriesRelations': relations
                });
				
				window.categories = relations;

                this.renderRows();

                this.clearLog();
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
            	this.showError(xhr.status + ', ' + thrownError);
            }.bind(this)
        });		
	},

    getToboxCategories: function() {
        $.ajax({
            type: "get",
            url: '/tobox/api/beta/categories/',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(data){
            	this.getCategories(data);
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                this.showError(xhr.status + ', ' + thrownError);
            }.bind(this)
        });
    },

	componentDidMount: function() {
		this.getToboxCategories();
    },
	
	preventClosingDropdown: function(e) {
		//alert('preventing dropdown to close');

	},

	filterCategoties: function(e) {
		var id = e.target.id.substring(13);
		ReactDOM.render(
			<div>
				<Input id={'search-input-' + id} className="search-tobox-categories" type="text" placeholder="Search..." onFocus={this.preventClosingDropdown} onChange={this.filterCategoties}/>
				<Nav className="table-nav-element">
					<NavDropdown id={'tobox-nav-cat-' + id} title={window.messages['not_selected']} data-selected='-1'>
						<MenuItem id={-1} key='-1' onClick={this.onCategoryClick} data-row={id}>{window.messages['not_selected']}</MenuItem>
						{this.generateCategoriesView(this.state.toboxCategories, id, e.target.value)}
					</NavDropdown>
				</Nav>
			</div>,
			document.getElementById('tobox-cat-' + id)
		);
		
		if(e.target.value != '')
		{
			if(!$(e.target).parent().parent().children('ul').children('li').hasClass("open"))
			{
				$(e.target).parent().parent().children('ul').children('li').children('a').get(0).click();
			}
		}
		else {
			if($(e.target).parent().parent().children('ul').children('li').hasClass("open"))
			{
				$(e.target).parent().parent().children('ul').children('li').children('a').get(0).click();
			}
		}
		
		
	},

    addRow: function() {
    	var id = this.state.rowId;
        var row = $('<tr id="row-cat-' + id + '"><td class="col-xs-2" id="cat-' + id + '"></td><td class="col-xs-2" id="yml-cat-' + id + '"></td><td class="table-nav-col" id="tobox-cat-' + id + '"></td><td class="text-center table-delete-col" id="delete-button-' + id + '"></td></tr>');
        $("#table-cat").append(row);
		
		
		ReactDOM.render(
			<Input className="table-element" type="text"/>,
			document.getElementById('cat-' + id)
		);

		ReactDOM.render(
			<Input className="table-element" type="number"/>,
			document.getElementById('yml-cat-' + id)
		);
		
		ReactDOM.render(
			<div>
				<Input id={'search-input-' + id} className="search-tobox-categories" type="text" placeholder="Search..." onFocus={this.preventClosingDropdown} onChange={this.filterCategoties}/>
				<Nav className="table-nav-element">
					<NavDropdown onClick={this.test} id={'tobox-nav-cat-' + id} title={window.messages['not_selected']} data-selected='-1'>
						<MenuItem id={-1} key='-1' onClick={this.onCategoryClick} data-row={id}>{window.messages['not_selected']}</MenuItem>
						{this.generateCategoriesView(this.state.toboxCategories, id, '')}
					</NavDropdown>
				</Nav>
			</div>,
			document.getElementById('tobox-cat-' + id)
		);
		
		ReactDOM.render(
			<Button className="table-element" bsStyle="danger" onClick={this.deleteRow.bind(this, id)}>{window.translate('delete')}</Button>,
			document.getElementById('delete-button-' + id)
		);
		
		this.state.rowId += 1;
    },

    deleteRow: function(id) {
		var elem = document.getElementById('row-cat-' + id);
		elem.parentNode.removeChild(elem);
	},

	rowSelect: function(row, data) {
		var elem = document.getElementById('row-cat-' + (row-1).toString());
		var ul = elem.querySelectorAll('ul.nav');
		var input = elem.querySelectorAll('.table-element');
		if(input.length > 0)
		{
			input[0].value = data[0];
			input[1].value = data[1]
		}
		
		ul[0].setAttribute("data-selected", data[2][0]);
		var spans = ul[0].getElementsByTagName('span');
		if(spans.length > 0) {
			spans[0].innerHTML = data[2][1];
		}
	},
	
	getFullCategoryName: function(node, id) {
		var result = '';
		for(var key in node) {
			var cat = node[key];
			if( cat['id'] == id) {
				result = cat['title'];
				return result;
			}
			result = this.getFullCategoryName(cat['child'], id);
			if(result.length > 0) {
				result = cat['title'] + ' &#x2192 ' + result;
				return result;
			}
		}
		return result;
	},

	getPrevToboxData: function(node, id) {
		var result = [];
		for(var key in node) {
			var cat = node[key];
			if( cat['id'] == id) {
				result[0] = cat['id'];
				result[1] = cat['title'];
				return result;
			}
			result = this.getPrevToboxData(cat['child'], id);
			if(result.length > 0) {
				result[1] = cat['title'] + ' &#x2192 ' + result[1];
				return result;
			}
		}
		return result;
	},

	renderRows: function() {
		var rows = this.state.categoriesRelations;
		if (Object.keys(rows).length > 0) {
			$.each(rows, function(key, value) {
				value.map(function(element) {
					setTimeout(function() {
						this.addRow();
						var tobox_data = this.getPrevToboxData(this.state.toboxCategories, element[1]);
						this.rowSelect(this.state.rowId, [key, element[0], tobox_data]);
					}.bind(this), 85);
				}.bind(this));
			}.bind(this));
		} else {
			this.addRow();
		}
	},

	onCategoryClick: function(e) {
		var elem = document.getElementById('tobox-cat-' + e.target.dataset.row);
		var ul = elem.getElementsByTagName('ul');
		if(ul.length > 0) {
			ul[0].setAttribute("data-selected", e.target.id);
		}
		var spans = elem.getElementsByTagName('span');
		if(spans.length > 0) {
			if(e.target.id != '-1') {
				spans[0].innerHTML = this.getFullCategoryName(this.state.toboxCategories, parseInt(e.target.id), 10);
			} else {
				spans[0].innerHTML = e.target.text;
			}
		}
	},

	generateCategoriesView: function(childs, rowId, q) {
		var result = [];
		childs.map(function(child) {
			var tmp = null;
			
			if(child['child'].length == 0) {
				if(q == '' || child['title'].toLowerCase().indexOf(q.toLowerCase())>=0) {
					result.push(
						<MenuItem id={child['id']} key={child['id']} onClick={this.onCategoryClick} data-row={rowId}>{child['title']}</MenuItem>
					);
					return result;
				}	
			}
			
			tmp = this.generateCategoriesView(child['child'], rowId, q);
			if(tmp.length > 0) {
				result.push(
					<NavDropdown id={child['id']} title={child['title']} key={child['id']} data-row={rowId} >
						{tmp}
					</NavDropdown>
				);
			}


		}.bind(this));
		return result;
	},

	update: function() {
		var relations = {};

		$('#table-cat > tr').each(function() {
			var user_cat = '';
			var input = this.querySelectorAll('.table-element');
			if(input.length > 0) {
				var user_cat = input[0].value;
				var yml_id = input[1].value;
			}

			var ul = this.querySelectorAll('ul.nav');
			if(ul.length > 0) {
				var tobox_cat = ul[0].getAttribute("data-selected");
				if (user_cat != '' && tobox_cat && tobox_cat != -1) {
					if(user_cat in relations)
					{
						relations[user_cat].push([yml_id, tobox_cat]);
					}
					else
					{
						relations[user_cat] = [[yml_id, tobox_cat]];
					}
				}
			}
		});

		$.ajax({
            type: 'post',
            url: '/importer/api/tobox/relations/category/',
            data: { user_id: this.state.userId, relation_json: JSON.stringify(relations) },
            success: function(data){
				$("#table-cat").empty();

                this.setState({
                	'categoriesRelations': JSON.parse(data['relation_json'])
                });
				window.categories = relations;
                this.renderRows();
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                this.showError(xhr.status + ', ' + thrownError);
            }.bind(this)
        });
	},

    render: function() {
    	var table = '';
    	if(this.state.toboxCategories.length != 0) {
    		table = <div>
    					<Row>
    						<Col xs={4} xsOffset={4}>
    							<Button bsSize="large" block className="update-button" onClick={this.update} bsStyle="primary">{window.translate('update')}</Button>
    						</Col>
    					</Row>
	    				<Table striped bordered condensed hover>
							<thead>
								<tr>
									<th className="col-xs-2">{window.translate('user_categories')}</th>
									<th className="col-xs-2">{window.translate('yml_category_id')}</th>
									<th className="table-nav-col">{window.translate('tobox_categories')}</th>
									<th className="table-delete-col"></th>
								</tr>
							</thead>
							<tbody id="table-cat">
							</tbody>
						</Table>
						<Button bsStyle="success" className="pull-right add-button" onClick={this.addRow} pull-right>{window.translate('add')}</Button>
					</div>;
    	}

    	return (
				<Row>
		    		<Col xs={10} xsOffset={1}>
		    			<div id="categories-relations-problem">
						</div>
						<Panel className="margin-panel" header={window.translate('assign_categories')} bsStyle="primary">
							{table}
						</Panel>
					</Col>
				</Row>
			
    	);
    }
})