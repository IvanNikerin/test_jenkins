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

var BackendLogger = require('./backend-logger');

var GridViewer = require('./grid-viewer');

module.exports = React.createClass({
	displayName: 'CsvXlsImporter',

	getInitialState: function() {
		return {
			'toboxCategories': [],
			'globalCategory': {id: -1, title: 'not selected'},
			'productsRelations': {},
			'userId': this.props.userId,
			'shopId': this.props.shopId,
			'hasData': false,
			'data': {sheets: []},
			'errorNeedHide': true,
			'messageNeedHide': true,
			//INFO: for tests with our login
			//'token': $.cookie('toboxkey'),
			'fileName': ''

		};
	},

	componentDidMount: function() {
		this.getToboxCategories();
	},

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
	    			ReactDOM.render(<ButtonInput  bsStyle="primary" value={window.translate('upload')} onClick={this.prepareUpdate}/>, document.getElementById('csv-xls-update-button'));
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
	    		file_type: 'csv-xls'
	    		//INFO: for tests with our login
	    		//token: this.state.token
	    	},
	    	success: function(data){
	    		//this.showMessage('Your product will be updated');
	    	}.bind(this)
   		});
	},

	prepareUpdate: function() {
		ReactDOM.render(<div></div>,
			document.getElementById('csv-xls-processing-container'));

		if (window.processing_upload)
		{
			return;
		}

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
				error = error + '! '+ window.translate('check_relations') +': ' + JSON.stringify(needed_keys[sheet]) + ' ' + window.translate('for_sheet') +': ' + sheet;
			}
		});
		if(error != "") {
			error = error.slice(2);
			this.showError(error);
		}
		
		if(error_count < Object.keys(this.state.data['sheets']).length)
		{
			ReactDOM.render(<BackendLogger userId={this.state.userId}
				processing_progress_id={'csv-xls-processing-progress-container'}
				processing_container_id={'csv-xls-processing-container-data'}
				processing_stats_id={'csv-xls-processing-stats'} />,
				document.getElementById('csv-xls-processing-container'));


			this.postUpdate(relation_json);
		}
	},

	viewError: function(msg) {
		ReactDOM.render(
   			<Panel header={<h3>{window.translate('error')}</h3>} bsStyle="danger">
      			<Row>
					<Col xs={12}>
						{msg}
					</Col>
				</Row>
    		</Panel>,
			document.getElementById('csv-xls-importer-problem')
		);
	},

	viewMessage: function(msg) {
		ReactDOM.render(
   			<Panel header={<h3>{window.translate('info')}</h3>} bsStyle="success">
      			<Row>
					<Col xs={12}>
						{msg}
					</Col>
				</Row>
    		</Panel>,
			document.getElementById('csv-xls-importer-message')
		);
	},

	showMessage : function(msg) {
		var self = this;
		this.viewMessage(msg);
		if(this.state.messageNeedHide) {
			setTimeout(function() {
				this.setState({messageNeedHide:true});
				this.hideMessage();
			}.bind(this), 5000);
		}
		this.setState({messageNeedHide:false});
	},

	showError : function(msg) {
		var self = this;
		this.viewError(msg);
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

	hideMessage: function() {
		ReactDOM.render(
			<div></div>,
			document.getElementById('csv-xls-importer-message')
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

	onProductsRelationsChange: function(products_relations) {
		this.setState({
			'productsRelations': products_relations
		});
	},

	render: function() {

		var content = '';

		if(this.state.hasData) {
			content = 
				<Panel header={<h3>{window.translate('configure_data')}</h3>} bsStyle="success">
					<Row>
						<Col xs={12}>
							{<Nav>
						        <NavDropdown id='categories-dropdown' title={window.translate('default_category') + ': ' + this.state.globalCategory['title']}>
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
											onProductsRelationsChange={this.onProductsRelationsChange}
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
					<Panel className="margin-panel" header={<h3>{window.translate('settings')}</h3>} bsStyle="primary">
						<Row>
							<Col xs={12}>
								<Panel header={<h3>{window.translate('file_selection')}</h3>}>
									<Input
										type="file"
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
					<div id="csv-xls-importer-message">
					</div>
					<div id="csv-xls-importer-problem">
					</div>
					<div id='csv-xls-processing-container'></div>
					<div id="csv-xls-xlsx-importer-content">
						{content}
			    	</div>
				</Col>
			</Row>
		);
	}
});