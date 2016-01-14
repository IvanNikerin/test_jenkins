﻿window.YmlImporter = React.createClass({
	getInitialState: function() {
		return {
		     file: ""
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
	
	parse: function(file, url) {
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
	    		this.viewYml(data);
				ReactDOM.render(<ProgressBar now={100} label="%(percent)s%" />, document.getElementById('progress-container'));
	    	}.bind(this)
   		});
	},
	

	scanFile: function() {
		this.parse(this.state.file, window.importer_api_host + 'api/parsers/yml/');
	},

	handleFile: function(event) {
		this.setState({file: ''});
		
    	let input = event.target;

		let extension = input.files[0].name.split('.').pop();

		let json_result = {};

    	if(extension == "yml" || extension == "xml") {

			this.setState({file: input.files[0]});
			ReactDOM.render(
			<Row>
				<Col xs={3}>
					<Button onClick={this.scanFile} >Scan YML</Button>
				</Col>
				<Col>
					<div id='btn-upload'>
						<ButtonInput  bsStyle="primary" value="Upload Products" onClick={this.uploadFile} />
					</div>
				</Col>
			</Row>,
			document.getElementById('btns-id')
			);
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