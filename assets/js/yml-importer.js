window.YmlImporter = React.createClass({
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
			ReactDOM.render(
				<Row>
					<Col xs={3}>
						<ButtonInput  bsStyle="primary" value="Upload Products" onClick={this.uploadFile} />
					</Col>
				</Row>,
				document.getElementById('btns-id')
			);
		} else { 
		    alert("Failed to load file");
		}	
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
	    		this.viewYml(data);
	    	}.bind(this)
   		});
	},

	handleFile: function(event) {
    	let input = event.target;

		let extension = input.files[0].name.split('.').pop();

		let json_result = {};

    	if(extension == "yml" || extension == "xml") {
    		this.parse(input.files[0], window.importer_api_host + 'api/parsers/yml/');
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