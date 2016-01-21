var $ = require('jquery');

var React = require('react');
var ReactDOM = require('react-dom');

var Panel = require('react-bootstrap').Panel;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Tab = require('react-bootstrap').Tab;
var Tabs = require('react-bootstrap').Tabs;
var ButtonInput = require('react-bootstrap').ButtonInput;
var Button = require('react-bootstrap').Button;
var Jumbotron = require('react-bootstrap').Jumbotron;
var Input = require('react-bootstrap').Input;
var ProgressBar = require('react-bootstrap').ProgressBar;

var YmlCategories = require('./yml-categories');
var YmlProducts = require('./yml-products');

module.exports = React.createClass({
	displayName: 'YmlImporter',
	
	getProfile: function() {
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
    },
	
	getInitialState: function() {
		return {
			'userId': '',
			'shopId': '',
		    file: "",
			data: [],
			enableUpload: false,
			errorNeedHide: true,
			'token': $.cookie('toboxkey'),
			'tokens': $.cookie('toboxskey')
		};
	},
	
	componentDidMount: function() {
		this.getProfile();
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
				var exists = false;
	    		if(!('error' in result)) {
		    		var relation_json = JSON.parse(result['relation_json']);
		    		if(result['file_name'] == filename) {
						exists = true;
		    		}
	    		}
				if(exists) {
					var new_data = {'categories': {}, 'prod_struct': {}};
					new_data['prod_struct'] = data['prod_struct'];
					if(relation_json['attrs'].length != 0 || relation_json['params'].length != 0) {
						new_data['prod_struct']['rels'] = true;
						new_data['prod_struct']['attrs-rels'] = relation_json['attrs'];
						new_data['prod_struct']['params-rels'] = relation_json['params'];
					}

					new_data['categories'] = data['categories'];
					if(Object.keys(relation_json['categories']).length > 0) {
						new_data['cat-rels'] = relation_json['categories'];
					}
					
					this.viewYml(new_data);
				} else {
					this.viewYml(data);
				}
				this.setState({data: data['data']});
				this.setState({enableUpload: true});
				ReactDOM.render(<ProgressBar now={100} label="%(percent)s%" />, document.getElementById('progress-container'));
				setTimeout(function() {
	    			ReactDOM.render(<div></div>, document.getElementById('progress-container'));
				}.bind(this),1500);
	    	}.bind(this)
   		});
	},
	
	viewError: function(message) {
		ReactDOM.render(
   			<Panel header={<h3>Configure data</h3>} bsStyle="danger">
      			<Row>
					<Col xs={12}>
						{message}
					</Col>
				</Row>
    		</Panel>,
			document.getElementById('yml-importer-content')
		);
	},
	
	clearContent: function() {
		ReactDOM.render(
			<div></div>,
			document.getElementById('yml-importer-content')				
		);
	},
	
	viewYml: function(data) {
		if (data) {
			ReactDOM.render(
				<Tabs defaultActiveKey={1}>
					<Tab eventKey={1} title="Categories">
						<Panel header={<h3>Configure data</h3>} bsStyle="success">
							<Row>
								<YmlCategories data={data['categories']} rels={data['cat-rels']} />		
							</Row>
						</Panel>
					</Tab>
					<Tab eventKey={2} title="Products">
						<Panel header={<h3>Configure data</h3>} bsStyle="success">
							<Row>
								<YmlProducts data={data['prod_struct']} />		
							</Row>
						</Panel>
					</Tab>
				</Tabs>,
				document.getElementById('yml-importer-content')				
			);
		} else { 
		    alert("Failed to load file");
		}	
	},
	
	isUrl : function(str) {
		if (str.indexOf("http://")>-1 || str.indexOf("https://")>-1) {
			return true;
		} else {
			return false;
		}
	},
	
	showWarning : function(msg) {
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
	
	uploadFile : function() {
		this.hideError();
		if(this.state.file == '') {
			this.showWarning('Please select file');
			return;
		}
		if(!this.state.enableUpload) {
			this.showWarning('Please scan your file');
			return;
		}
		
		var auto = document.getElementById('shop-autoupdate').checked;
		var autoupdate_url = document.getElementById('shop-autoupdate-url').value;

		if(auto && !(this.isUrl(autoupdate_url))) {
			this.showWarning('Please enter correct URL');
			return;
		}
		
		
		var relation_data = {};
		var data_prods = {};
		var pics = new Array();
		var war = '';
		
		var data_cats = {};
		$('#table-cat > tr').each(function() {
			var ul = this.querySelectorAll('ul.nav');
			if(ul.length > 1) {
				var yml_cat = ul[0].getAttribute("data-selected");
				var tobox_cat = ul[1].getAttribute("data-selected");
				if(yml_cat && yml_cat != '-1') {
					data_cats[yml_cat] = tobox_cat;
				} else {
					if(war == '') {
						war += 'Not all category relations are set. ';
					}
				}
			}
		});
		
		var data_attrs = new Array();
		$('#prod-attr > tr').each(function() {
			var tmp = {};
			var selects = this.getElementsByTagName('select');
			var autoupdate = this.getElementsByTagName('input');
			if(selects.length > 1) {
				tmp['yml'] = selects[0].value;
				tmp['tobox'] = selects[1].value;
			}
			if(autoupdate.length > 0) {
				tmp['autoupdate'] = autoupdate[0].checked;
			}
			if(tmp['tobox'] != '-1') {
				if(tmp['tobox'] == window.tobox_pictures) {
					pics.push(tmp['yml']);
				} else {
					data_prods[tmp['tobox']] = tmp['yml'];
				}
				data_attrs.push(tmp);
			}
		});
		
		var data_params = new Array();
		$('#prod-param > tr').each(function() {
			var tmp = {};
			var selects = this.getElementsByTagName('select');
			var autoupdate = this.getElementsByTagName('input');
			if(selects.length > 1) {
				tmp['yml'] = selects[0].value;
				tmp['tobox'] = selects[1].value;
			}
			if(autoupdate.length > 0) {
				tmp['autoupdate'] = autoupdate[0].checked;
			}
			if(tmp['tobox'] != '-1') {
				if(tmp['tobox'] == window.tobox_pictures) {
					pics.push(tmp['yml']);
				} else {
					data_prods[tmp['tobox']] = tmp['yml'];
				}
				data_params.push(tmp);
			}
		});
		
		var req_count = 0;
		for(var i in window.required ) {
			if(window.required[i] in data_prods) {
				req_count += 1;
			}
		}
		if(req_count < window.required.length) {
			war += 'Not all product relations are set';
		}
		
		if(war != '') {
			this.showWarning(war);
			//return;
		}
		
		if(pics.length > 0) {
			data_prods[window.tobox_pictures] = pics;
		}
		
		relation_data['categories'] = data_cats;
		relation_data['products'] = data_prods;
		relation_data['attrs'] = data_attrs;
		relation_data['params'] = data_params;
		//console.log(relation_data);
		
		var ajax_data = this.state.data;
		var fname = this.state.file.name;
		var shop = this.state.shopId;
		var usr = this.state.userId;
		console.log(fname, shop, usr, auto, autoupdate_url);
		
   		$.ajax({
	    	type: 'post',
	    	url: '/importer/api/tobox/relations/',
	    	data: {token: this.state.token, user_id: usr, shop_id: shop, update_url: 'url', relation_json: JSON.stringify(relation_data), autoupdate: true, data: JSON.stringify(ajax_data), file_name: fname, file_type:'yml'},
	    	success: function(data){
				console.log(data);
	    	}.bind(this)
   		});
		
	},
	
	parse: function() {
		this.hideError();
		var file = this.state.file;
		if(file == '') {
			this.viewError('Please select file', 'Warning');
			var self = this;
			if(this.state.errorNeedHide) {
				setTimeout(function() {
					self.setState({errorNeedHide:true});
					self.hideError();
				}, 8000);
			}
			this.setState({errorNeedHide:false});
			return;
		}
		var url = '/importer/api/parsers/yml/';
		this.clearContent();
		ReactDOM.render(<ProgressBar now={0} label="%(percent)s%" />, document.getElementById('progress-container'));
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
							ReactDOM.render(<ProgressBar now={percentComplete} label="%(percent)s%" />, document.getElementById('progress-container'));
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
				this.getRelations(data, file.name)
	    	}.bind(this)
   		});
	},
	
	viewError: function(message, title) {
		ReactDOM.render(
   			<Panel header={<h3>{title}</h3>} bsStyle="danger">
      			<Row>
					<Col xs={12}>
						{message}
					</Col>
				</Row>
    		</Panel>,
			document.getElementById('yml-importer-problem')
		);
	},

	hideError: function() {
		ReactDOM.render(
				<div></div>,
				document.getElementById('yml-importer-problem')
			);
	},

	handleFile: function(event) {
		this.setState({file: ''});
		this.setState({data: []});
		this.setState({enableUpload: false});
		this.hideError();
		
    	var input = event.target;
		var extension = input.files[0].name.split('.').pop();
    	if(extension == "yml" || extension == "xml") {
			this.setState({file: input.files[0]});
    	} else {
			this.viewError("Bad file type");
    	}
	},

	render: function() {
		return (
			<Jumbotron>
				<Row>
					<Col xs={10} xsOffset={1}>
						<Panel header={<h3>Settings</h3>} bsStyle="primary">
							<Row>
								<Col xs={12}>
									<Panel header={<h3>Select file</h3>}>
						   				<Input 
						   					type="file"
						   					help="Select YML file"
						   					ref="filename"
						   					onChange={this.handleFile} />

					   				</Panel>
					   			</Col>
					   		</Row>
							<Row>
								<Col xs={12}>
									<div id='progress-container'></div>
								</Col>
							</Row>
							<Row>
								<Col xs={3}>
									<Button onClick={this.parse} >Scan YML</Button>
								</Col>
								<Col xs={3}>
									<div id='btn-upload'>
										<ButtonInput bsStyle="primary" value="Upload Products" onClick={this.uploadFile} />
									</div>
								</Col>
								<Col xs={2}>
									<Input id="shop-autoupdate" type="checkbox" label="Autoupdate" />	
								</Col>
								<Col xs={4}>
									<Input id="shop-autoupdate-url" type="text" placeholder="Autoupdate URL" />
								</Col>
							</Row>
						</Panel>
						<div id="yml-importer-problem">
						</div>
						<div id="yml-importer-content" className="table-responsive">
					   	</div>
					</Col>
				</Row>
			</Jumbotron>
		);
	}
});