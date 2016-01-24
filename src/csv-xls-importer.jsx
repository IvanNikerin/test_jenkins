var $ = require('jquery');

var React = require('react');
var ReactDOM = require('react-dom');

var Panel = require('react-bootstrap').Panel;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var GridViewer = require('react-bootstrap').GridViewer;
var Jumbotron = require('react-bootstrap').Jumbotron;
var Input = require('react-bootstrap').Input;
var Nav = require('react-bootstrap').Nav;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var Button = require('react-bootstrap').Button;
var ButtonInput = require('react-bootstrap').ButtonInput;
var ProgressBar = require('react-bootstrap').ProgressBar;
var DropdownButton = require('react-bootstrap').DropdownButton;

var GridViewer = require('./grid-viewer');

module.exports = React.createClass({
	displayName: 'CsvXlsImporter',

	/*getProfile: function() {
        $.ajax({
            type: "post",
            url: '/tobox/api/beta/profile',
            crossDomain: true,
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(data){
                if (this.isMounted()) {
                    this.setState({
                        shopId: data["shopIds"][0],
                        userId: data["userId"]
                    });
                }
            }.bind(this)
        });        
    },*/

	getInitialState: function() {
		return {
			/*'categories_relations': {},
			'products_relations': {},
			'data': {sheets: []},
			'has_data': false,
			'userId': '',
			'shopId': '',
			'fileName': '',
			'token': $.cookie('toboxkey'),
			'tokens': $.cookie('toboxskey'),*/

			'toboxCategories': [],
			'globalCategory': {id: -1, title: 'not selected'},
			'productsRelations': {},
			'userId': this.props.userId,
			'shopId': this.props.shopId,
			'hasData': false,
			'data': {sheets: []},
			'errorNeedHide': true,
			'token': $.cookie('toboxkey'),
			'fileName': ''

		};
	},

	componentDidMount: function() {
		this.getToboxCategories();
	},

	/*onCategoriesRelationSet: function(sheet, tobox) {
		var categories_relations = this.state.categories_relations;
		categories_relations[sheet] = tobox;
		this.setState({
			'categories_relations': categories_relations
		});
	},*/

	setDefaultRelations: function(data) {
		var products_relations = {};
		
		$.each(Object.keys(data['sheets']), function() {
			var sheet = this;

			products_relations[sheet] = {};
			
			$.each(data['sheets'][sheet]['header'], function(){
				products_relations[sheet][this] = {title: 'not selected', id: -1, 'is_primary': false};
			});
		});

		this.setState({
			'productsRelations': products_relations,
			'globalCategory': {id: -1, title: 'not selected'}
		});
	},

	onCategoriesClick: function(e) {
		var id = -1;
		var text = "";

		if (e.target.className == "caret") {
			id = e.target.parentNode.parentNode.id;
			text = e.target.parentNode.parentNode.innerText;
		}
		else if(e.target.id == "") {
			id = e.target.parentNode.id;
			text = e.target.parentNode.innerText;
		}
		else {
			id = e.target.id;
			text = e.target.innerText;
		}

		this.setState({
			'globalCategory': {id: id, title: text}
		});
	},

	//generateCategoriesView: function(sheet, childs) {
	//	var result = [];

		/*childs.map(function(child) {
			if(child['child'].length == 0) {
				result.push(
					<MenuItem id={sheet + '_' + child['id']} key={child['id']} onClick={this.onCategoriesClick}>{child['title']}</MenuItem>
				);
				return result;
			}

			result.push(
				<NavDropdown id={sheet + '_' + child['id']} title={child['title']} key={child['id']}>
					{this.generateCategoriesView(sheet, child['child'])}
	    		</NavDropdown>
			);
		}.bind(this));*/

	//	return result;
	//},

	/*viewError: function(message, id, title) {
		ReactDOM.render(
   			<Panel header={<h3>{title}</h3>} bsStyle="danger">
      			<Row>
					<Col xs={12}>
						{message}
					</Col>
				</Row>
    		</Panel>,
			document.getElementById(id)
		);
	},

	hideError: function(id) {
		ReactDOM.render(
				<div></div>,
				document.getElementById(id)
			);
	},*/

	getRelations: function(data, filename) {
		$.ajax({
	    	type: 'get',
	    	url: '/importer/api/tobox/relations/',
	    	data: {
	    		user_id: this.state.userId,
	    		file_name: filename
	    	},
	    	success: function(result){
	    		if('relation_json' in result) {
		    		var relation_json = JSON.parse(result['relation_json']);
		    		var global_category = this.state.globalCategory;

		    		if(result['file_name'] == filename) {
		    			if ('global_category' in relation_json) {
		    				global_category = relation_json['global_category'];
		    			}

		    			Object.keys(relation_json['products']['sheets']).map(function(sheet) {
		    				if(sheet in data['sheets']) {
		    					Object.keys(relation_json['products']['sheets'][sheet]).map(function(header) {
		    						if(data['sheets'][sheet]['header'].indexOf(header) != -1) {
		    							var products_relations = this.state.productsRelations;
		    							
		    							products_relations[sheet][header] = relation_json['products']['sheets'][sheet][header];
		    							
		    							this.setState({
		    								'productsRelations': products_relations,
		    								'globalCategory': global_category
		    							});
		    						}
		    					}.bind(this));
		    				}
		    			}.bind(this));
		    		}
	    		}
	    		else {
	    			this.setDefaultRelations(data);
	    		}
	    	}.bind(this)
   		});
	},

	parse: function(file, url) {
		ReactDOM.render(<ProgressBar now={0} label="%(percent)s%" />, document.getElementById('csv-xls-progress-container'));
   		$.ajax({
			xhr: function() {
				var xhr = new window.XMLHttpRequest();
				var count = 0;

				xhr.upload.addEventListener("progress", function(evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						percentComplete = parseInt(percentComplete * 100);
					
						if(count > 5){
							count = 0;
							ReactDOM.render(<ProgressBar now={percentComplete} label="%(percent)s%" />, document.getElementById('csv-xls-progress-container'));
						} else {
							count+=1;
						}
					}
				}, false);

				return xhr;
			  },   			
	    	type: 'put',
	    	url: url,
	    	data: file,
	    	processData: false,
	    	"headers": {
    			"content-type": "text/plain"
  			},
	    	success: function(data){
	    		ReactDOM.render(<ProgressBar now={100} label="%(percent)s%" />, document.getElementById('csv-xls-progress-container'));
	    		setTimeout(function() {
	    			ReactDOM.render(<div></div>, document.getElementById('csv-xls-progress-container'));
	    			ReactDOM.render(<ButtonInput  bsStyle="primary" value="Upload" onClick={this.prepareUpdate}/>, document.getElementById('csv-xls-update-button'));
	    		}.bind(this),1500);

	    		this.setDefaultRelations(data);

	    		this.getRelations(data, file.name);

	    		this.setState({
	    			'data': data,
	    			'hasData': true,
	    			'fileName': file.name
	    		});
	    	}.bind(this)
   		});
	},

	handleFile: function(event) {
    	var input = event.target;

		var extension = input.files[0].name.split('.').pop();

		this.setState({
			'has_data': false
		});

		ReactDOM.render(<div></div>, document.getElementById('csv-xls-update-button'));

    	if(extension == "xls" || extension == "xlsx") {
    		this.parse(input.files[0], '/importer/api/parsers/xls/');
    	}
    	else if(extension == "csv") {
    		this.parse(input.files[0], '/importer/api/parsers/csv/');
    	}
    	else {
			this.viewError("Bad file type", 'csv-xls-importer-problem', 'Error');
			setTimeout(function() {
				this.hideError('csv-xls-importer-problem');
			}.bind(this), 7000);
			return;
    	}
	},

	postUpdate: function(relation_json) {
		$.ajax({  			
	    	type: 'post',
	    	url: '/importer/api/tobox/relations/',
	    	data: {
	    		user_id: this.state.userId,
	    		shop_id: this.state.shopId,
	    		relation_json: JSON.stringify(relation_json),
	    		data: JSON.stringify(this.state.data),
	    		file_name: this.state.fileName,
	    		file_type: 'csv-xls',
	    		token: this.state.token
	    	},
	    	success: function(data){
	    		console.log(data);
	    	}
   		});
	},

	prepareUpdate: function() {
		var global_category = this.state.globalCategory;
		var products_relations = this.state.productsRelations;

		var relation_json = {
			global_category:global_category, products:{'sheets':{}}
		};

		var needed_keys = {};

		Object.keys(this.state.data['sheets']).map(function(sheet) {
			needed_keys[sheet] = ['Картинка', 'Заголовок', 'Описание', 'Цена'];
		});

		Object.keys(this.state.data['sheets']).map(function(sheet) {
			relation_json['products']['sheets'][sheet] = {};

			this.state.data['sheets'][sheet]['header'].map(function(header) {
				if(products_relations[sheet][header]['id'] != -1) {
					var index = needed_keys[sheet].indexOf(products_relations[sheet][header]['title'].replace(/\s/g, ''));
					if(index != -1)
						needed_keys[sheet].splice(index, 1);
					relation_json['products']['sheets'][sheet][header] = {
						title: products_relations[sheet][header]['title'],
						id: products_relations[sheet][header]['id'],
						is_primary: products_relations[sheet][header]['is_primary']
					};
				}
			}.bind(this));
		}.bind(this));

		error = "";

		var error_count = 0;

		Object.keys(this.state.data['sheets']).map(function(sheet) {
			if(needed_keys[sheet].length != 0) {
				error_count ++;
				error = error + '! Check required relations: ' + JSON.stringify(needed_keys[sheet]) + ' for sheet: ' + sheet;
			}
		});
		if(error != "") {
			error = error.slice(2);
			this.showError(error);
		}
		
		if(error_count < Object.keys(this.state.data['sheets']).length)
		{
			this.postUpdate(relation_json);
		}
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
			document.getElementById('csv-xls-importer-problem')
		);
	},

	showError : function(msg) {
		var self = this;
		this.viewError(msg);
		console.log(this.state.errorNeedHide);
		if(this.state.errorNeedHide) {
			setTimeout(function() {
				this.setState({errorNeedHide:true});
				this.hideError();
			}.bind(this), 5000);
		}
		this.setState({errorNeedHide:false});
	},

	hideError: function() {
		ReactDOM.render(
			<div></div>,
			document.getElementById('csv-xls-importer-problem')
		);
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
            	this.setState({
            		'toboxCategories': data
            	});
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                this.showError(xhr.status + ', ' + thrownError);
            }.bind(this)
        });
    },

    generateCategoriesView: function(childs) {
		var result = [];

		childs.map(function(child) {
			if(child['child'].length == 0) {
				result.push(
					<MenuItem id={child['id']} key={child['id']} onClick={this.onCategoriesClick}>{child['title']}</MenuItem>
				);
				return result;
			}

			result.push(
				<NavDropdown id={child['id']} title={child['title']} key={child['id']}>
					{this.generateCategoriesView(child['child'])}
	    		</NavDropdown>
			);
		}.bind(this));

		return result;
	},

	render: function() {
		/*var content = "";

		if(this.state.has_data) {
			content = <Panel header={<h3>Configure data</h3>} bsStyle="success">
				    		<Row>
								<Col xs={12}>
									<Nav>
				                        <NavDropdown title='test'>
				                           	<MenuItem key='-1' onClick={this.onCategoriesClick}>not selected</MenuItem>
				                           		{this.generateCategoriesView(sheet, window.categories)}
				                        </NavDropdown>
				                    </Nav>
									{Object.keys(this.state.data['sheets']).map(function(sheet) {
										return
											<Panel key={sheet} header={sheet}>
												<GridViewer
													sheet={sheet}
													data={this.state.data['sheets'][sheet]['data']}
													products_relations={this.state.products_relations}
													onProductsRelationSet={this.onProductsRelationSet}
												/>
											</Panel>
									}.bind(this))}
								</Col>
							</Row>
				    	</Panel>;
		}*/

		/*return (
				<Row>
					<Col xs={10} xsOffset={1}>
						<Panel className="margin-panel" header={<h3>Settings</h3>} bsStyle="primary">
							<Row>
								<Col xs={12}>
									<Panel header={<h3>Select file</h3>}>
						   				<Input 
						   					type="file"
						   					help="Select csv/xls/xlsx file"
						   					ref="filename"
						   					onChange={this.handleFile} />
					   				</Panel>
					   			</Col>
					   		</Row>
							<Row>
								<Col xs={3}>
									<div id="csv-xls-update-button">
									</div>
								</Col>
								<Col xs={12}>
									<div id='csv-xls-progress-container'></div>
								</Col>
							</Row>			   		
						</Panel>
						<div id="csv-xls-importer-problem">
						</div>
						<div id="csv-xls-xlsx-importer-content">
							{content}
			    		</div>
					</Col>
				</Row>
		);*/

		var content = '';

		if(this.state.hasData) {
			content = 
				<Panel header={<h3>Configure data</h3>} bsStyle="success">
					<Row>
						<Col xs={12}>
							{<Nav>
						        <NavDropdown id='categories-dropdown' title={'Global category: ' + this.state.globalCategory['title']}>
						            <MenuItem id='-1' key='-1' onClick={this.onCategoriesClick}>not selected</MenuItem>
						           		{this.generateCategoriesView(this.state.toboxCategories)}
						        </NavDropdown>
						    </Nav>}
						    {Object.keys(this.state.data['sheets']).map(function(sheet) {
								return <Panel key={sheet} header={sheet}>
										<GridViewer
											sheet={sheet}
											data={this.state.data['sheets'][sheet]['data']}
											products_relations={this.state.productsRelations}
										/>
									</Panel>
							}.bind(this))}
						</Col>
					</Row>
				</Panel>;
		}

		return (
			<Row>
				<Col xs={10} xsOffset={1}>
					<Panel className="margin-panel" header={<h3>Settings</h3>} bsStyle="primary">
						<Row>
							<Col xs={12}>
								<Panel header={<h3>Select file</h3>}>
									<Input 
										type="file"
					  					help="Select csv/xls/xlsx file"
					   					ref="filename"
					   					onChange={this.handleFile} />
				   				</Panel>
				   			</Col>
				   		</Row>
						<Row>
							<Col xs={3}>
								<div id="csv-xls-update-button">
								</div>
							</Col>
							<Col xs={12}>
								<div id='csv-xls-progress-container'></div>
							</Col>
						</Row>			   		
					</Panel>
					<div id="csv-xls-importer-problem">
					</div>
					<div id="csv-xls-xlsx-importer-content">
						{content}
			    	</div>
				</Col>
			</Row>
		);
	}
});