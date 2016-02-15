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
			ymlCats: {},
			enableUpload: false,
			errorNeedHide: true,
			// INFO: for tests with our login
			/*'token': $.cookie('toboxkey'),
			'tokens': $.cookie('toboxskey')*/
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
				var relation_json = {};
				var autoupdate = false;
				var autoupdate_url = '';
	    		if(!('error' in result)) {
	    			if('relation_json' in result) {
	    				relation_json = JSON.parse(result['relation_json']);
	    				autoupdate = result['autoupdate'];
	    				autoupdate_url = result['update_url'];
			    		if(result['file_name'] == filename) {
							exists = true;
			    		}
		    		}
	    		}
				if(exists) {
					document.getElementById('shop-autoupdate').checked = autoupdate;
					document.getElementById('shop-autoupdate-url').value = autoupdate_url;
					var new_data = {'categories': {}, 'prod_struct': {}};
					new_data['prod_struct'] = data['prod_struct'];
					if(relation_json['attrs'].length != 0 || relation_json['params'].length != 0) {
						new_data['prod_struct']['rels'] = true;
						new_data['prod_struct']['attrs-rels'] = relation_json['attrs'];
						new_data['prod_struct']['params-rels'] = relation_json['params'];
					}
					
					this.viewYml(new_data);
				} else {
					this.viewYml(data);
				}
				this.setState({data: data['data']});
				this.setState({ymlCats: data['categories']});
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

	viewMessage: function(message) {
		ReactDOM.render(
   			<Panel header={<h3>Success</h3>} bsStyle="success">
      			<Row>
					<Col xs={12}>
						{message}
					</Col>
				</Row>
    		</Panel>,
			document.getElementById('yml-importer-problem')
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
				<Panel header={<h3>Configure data</h3>} bsStyle="success">
					<Row>
						<YmlProducts data={data['prod_struct']} />		
					</Row>
				</Panel>,
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

	showMessage : function(msg) {
		var self = this;
		this.viewMessage(msg, 'Success');
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

		for(var key in window.categories) {
			for(var catname in this.state.ymlCats) {
				if(key == catname) {
					data_cats[this.state.ymlCats[catname]['id']] = window.categories[key];
					continue;
				}
			}
		}
		
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
		
		if(pics.length > 0) {
			data_prods[window.tobox_pictures] = pics;
		}
		
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
			return;
		}
		
		relation_data['categories'] = data_cats;
		relation_data['products'] = data_prods;
		relation_data['attrs'] = data_attrs;
		relation_data['params'] = data_params;
		
		var ajax_data = this.state.data;
		var fname = this.state.file.name;
		var shop = this.state.shopId;
		var usr = this.state.userId;
		
   		$.ajax({
	    	type: 'post',
	    	url: '/importer/api/tobox/relations/',
	    	data: {/*token: this.state.token,*/ user_id: usr, shop_id: shop, update_url: autoupdate_url, relation_json: JSON.stringify(relation_data), autoupdate: auto, data: JSON.stringify(ajax_data), file_name: fname, file_type:'yml'},
	    	success: function(data){
	    		this.showMessage('Your product will be updated')
	    	}.bind(this)
   		});
		
	},
	
	uploadYmlFile: function(file) {
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
	
	uploadYmlUrl: function(yml_url, gen_file_name) {
		var url = '/importer/api/parsers/yml/';
		this.clearContent();
		$.ajax({
	    	type: 'get',
	    	url: url,
	    	data: {
	    		url: yml_url,
	    		filename: gen_file_name
	    	},
	    	success: function(data){
				this.getRelations(data, gen_file_name)
	    	}.bind(this)
   		});
	},
	
	parse: function() {
		this.hideError();
		var file = this.state.file;
		var yml_url = document.getElementById('shop-autoupdate-url').value;
		if(file == '') {
			if(yml_url == '') {
				this.viewError('Please select file or set correct URL to your YML', 'Warning');
				var self = this;
				if(this.state.errorNeedHide) {
					setTimeout(function() {
						self.setState({errorNeedHide:true});
						self.hideError();
					}, 8000);
				}
				this.setState({errorNeedHide:false});
				return;
			} else { 
				var urlparts = yml_url.substring(yml_url.lastIndexOf("/") + 1).split("?");
				if(urlparts.length > 1) {
					this.setState({file: urlparts[1]});
					this.uploadYmlUrl(yml_url, urlparts[1]);
				}
			}
		} else {
			this.uploadYmlFile(file);
		}
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
		
		//var extension = input.files[0].name.split('.').pop();
    	//if(extension == "yml" || extension == "xml") {
		this.setState({file: input.files[0]});
    	//} else {
		//	this.viewError("Bad file type");
    	//}
	},

	render: function() {
		return (
				<Row>
					<Col xs={10} xsOffset={1}>
						<Panel className="margin-panel" header={<h3>Settings</h3>} bsStyle="primary">
							<Row>
								<Col xs={12}>
									<Panel header={<h3>Select file or url</h3>}>
										<Row>
											<Col xs={6}>
								   				<Input 
								   					type="file"
								   					help="Select YML file"
								   					ref="filename"
								   					onChange={this.handleFile} />
								   			</Col>		
							   				<Col xs={6}>
												<Input id="shop-autoupdate-url" type="text" placeholder="URL" />
											</Col>
										</Row>
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
									<Button onClick={this.saveChanges}> Save changes</Button>
								</Col>
								<Col xs={3}>
									<div id='btn-upload'>
										<ButtonInput bsStyle="primary" value="Upload Products" onClick={this.uploadFile} />
									</div>
								</Col>
								<Col xs={2}>
									<Input id="shop-autoupdate" type="checkbox" label="Autoupdate" />	
								</Col>
							</Row>
						</Panel>
						<div id="yml-importer-problem">
						</div>
						<div id="yml-importer-content" className="table-responsive">
					   	</div>
					</Col>
				</Row>
		);
	}
});