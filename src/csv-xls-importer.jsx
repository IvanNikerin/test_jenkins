var $ = require('jquery');

var React = require('react');
var ReactDOM = require('react-dom');

var Panel = require('react-bootstrap').Panel;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var GridViewer = require('react-bootstrap').GridViewer;
var Jumbotron = require('react-bootstrap').Jumbotron;
var Input = require('react-bootstrap').Input;

var GridViewer = require('./grid-viewer');

module.exports = React.createClass({
	displayName: 'CsvXlsImporter',

	viewError: function(message) {
		ReactDOM.render(
   			<Panel header={<h3>Configure data</h3>} bsStyle="danger">
      			<Row>
					<Col xs={12}>
						{message}
					</Col>
				</Row>
    		</Panel>,
			document.getElementById('csv-xls-xlsx-importer-content')
		);
	},

	viewData: function(data) {
		ReactDOM.render(
   			<Panel header={<h3>Configure data</h3>} bsStyle="success">
      			<Row>
					<Col xs={12}>
						{Object.keys(data['sheets']).map(function(result) {
							return <Panel key={result} header={<h3>{result}</h3>}>
								<GridViewer header={data['sheets'][result]['header']} data={data['sheets'][result]['data']} />
							</Panel>
						})}
					</Col>
				</Row>
    		</Panel>,
			document.getElementById('csv-xls-xlsx-importer-content')
		);
	},

	parse: function(file, url) {
   		$.ajax({
	    	type: 'put',
	    	url: url,
	    	data: file,
	    	processData: false,
	    	"headers": {
    			"content-type": "text/plain"
  			},
	    	success: function(data){
	    		this.viewData(data);
	    	}.bind(this)
   		});
	},

	handleFile: function(event) {
    	var input = event.target;

		var extension = input.files[0].name.split('.').pop();

		var json_result = {};

    	if(extension == "xls" || extension == "xlsx") {
    		this.parse(input.files[0], '/importer/api/parsers/xls/');
    	}
    	else if(extension == "csv") {
    		this.parse(input.files[0], '/importer/api/parsers/csv/');
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
						   					help="Select csv/xls/xlsx file"
						   					ref="filename"
						   					onChange={this.handleFile} />
					   				</Panel>
					   			</Col>
					   		</Row>
						</Panel>
						<div id="csv-xls-xlsx-importer-content">
					   	</div>
					</Col>
				</Row>
			</Jumbotron>
		);
	}
});