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
	getInitialState: function() {
		return {
		     file: "",
			 data: []
		};
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
								<YmlCategories data={data['categories']} />		
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
	
	uploadFile : function() {
		var relation_data = {};
		
		var data_cats = new Array();
		$('#table-cat > tr').each(function() {
			var selects = this.getElementsByTagName('select');
			if(selects.length > 1) {
				data_cats.push({'yml':selects[0].value, 'tobox':selects[1].value});
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
				tmp['autoupdate'] = autoupdate[0].value;
			}
			data_attrs.push(tmp);
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
				tmp['autoupdate'] = autoupdate[0].value;
			}
			data_params.push(tmp);
		});
		
   		$.ajax({
	    	type: 'post',
	    	url: '/importer/api/tobox/relations/',
	    	data: {user_id:'test', shop_id:'test', update_url:'url', relation_json:relation_data, autoupdate:true, data:this.state.data, type:'yml'},
	    	success: function(data){
				console.log(data);
	    	}.bind(this)
   		});
	},
	
	parse: function() {
		var file = this.state.file;
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
				this.setState({data: data});
	    		this.viewYml(data);
				ReactDOM.render(<ProgressBar now={100} label="%(percent)s%" />, document.getElementById('progress-container'));
	    	}.bind(this)
   		});
	},

	handleFile: function(event) {
		this.setState({file: ''});
		this.setState({data: []});
		
    	var input = event.target;

		var extension = input.files[0].name.split('.').pop();



    	if(extension == "yml" || extension == "xml") {

			this.setState({file: input.files[0]});
    	}
    	else {
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
										<ButtonInput  bsStyle="primary" value="Upload Products" onClick={this.uploadFile} />
									</div>
								</Col>
								<Col xs={2}>
									<Input type="checkbox" label="Autoupdate" />	
								</Col>
								<Col xs={4}>
									<Input type="url" placeholder="Autoupdate URL" />
								</Col>
							</Row>
						</Panel>
						<div id="yml-importer-content" className="table-responsive">
					   	</div>
					</Col>
				</Row>
			</Jumbotron>
		);
	}
});