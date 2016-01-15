var $ = require('jquery');

var React = require('react');
var ReactDOM = require('react-dom');

var Panel = require('react-bootstrap').Panel;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Tab = require('react-bootstrap').Tab;
var Tabs = require('react-bootstrap').Tabs;
var ButtonInput = require('react-bootstrap').ButtonInput;
var Jumbotron = require('react-bootstrap').Jumbotron;
var Input = require('react-bootstrap').Input;

var YmlCategories = require('./yml-categories');
var YmlProducts = require('./yml-products');

module.exports = React.createClass({
	displayName: 'YmlImporter',
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
	
	uploadFile: function() {
		alert('hui');
	},
	
	viewYml: function(file) {
		if (file) {
			var r = new FileReader();
			r.onload = function(e) { 
				var xml = $.parseXML(e.target.result);
				ReactDOM.render(
					<Tabs defaultActiveKey={1}>
						<Tab eventKey={1} title="Categories">
							<Panel header={<h3>Configure data</h3>} bsStyle="success">
								<Row>
									<YmlCategories />
								</Row>
							</Panel>
						</Tab>
						<Tab eventKey={2} title="Products">
							<Panel header={<h3>Configure data</h3>} bsStyle="success">
								<Row>
									<YmlProducts />
								</Row>
							</Panel>
						</Tab>
					</Tabs>,
					document.getElementById('yml-importer-content')				
				);
				ReactDOM.render(
					<Row>
						<Col xs={3}>
							<ButtonInput  bsStyle="primary" value="Upload Products" onClick={this.uploadFile} />
						</Col>
					</Row>,
					document.getElementById('btns-id')
				);
			}
			r.readAsText(file);
		} else { 
		  alert("Failed to load file");
		}	
	},

	handleFile: function(event) {
    	var input = event.target;

		var extension = input.files[0].name.split('.').pop();

		var json_result = {};

    	if(extension == "yml" || extension == "xml") {
    		this.viewYml(input.files[0]);
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
							<div id="btns-id">

							</div>
						</Panel>
						<div id="yml-importer-content" className="table-responsive">
					   	</div>
					</Col>
				</Row>
			</Jumbotron>
		);
	}
});