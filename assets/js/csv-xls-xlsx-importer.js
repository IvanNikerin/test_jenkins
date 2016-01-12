window.CsvXlsXlsxImporter = React.createClass({
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

	viewCsv: function(file) {
		let csvParser = new SimpleExcel.Parser.CSV();
		csvParser.loadFile(file, function () {
            let result = csvParser.getSheet();

			result.splice(-1,1)

			let headerList = [];

			let data = [];

			for(var topIter = 0; topIter < result.length; topIter++) {
				let childData = [];
				for(var childIter = 0; childIter < result[topIter].length; childIter++) {
					if(topIter == 0) {
						headerList.push(result[topIter][childIter].value);
					}
					else {
						childData.push(result[topIter][childIter].value);
					}
				}

				if(childData.length != 0)
					data.push(childData);
			}

			ReactDOM.render(
   				<Panel header={<h3>Configure data</h3>} bsStyle="success">
      				<Row>
						<Col xs={12}>
							<GridViewer header={headerList} data={data} />
						</Col>
					</Row>
    			</Panel>,
				document.getElementById('csv-xls-xlsx-importer-content')
			);
        });
	},

	viewXlsXlsx: function(file, parser) {
		let reader = new FileReader();
    		
    	reader.onload = function(){
      		let result = reader.result;
      		let workbook = parser.read(result, {type: 'binary'});
      		let sheet_name_list = workbook.SheetNames;

      		let headerDict = {};

      		let dataDict = {};

      		workbook.SheetNames.forEach(function(sheetName) {
      			let headerList = [];
				var worksheet = workbook.Sheets[sheetName];
  				for (var z in worksheet) {
    				if(z[0] === '!') continue;
    				if(z[1] === '1') {
    					headerList.push(worksheet[z].v);
    				}
    				if(z[1] === '2') {
    					break;
    				}
  				}

  				let json_data = parser.utils.sheet_to_json(workbook.Sheets[sheetName]);

  				dataDict[sheetName] = [];

  				json_data.map(function(top) {
  					let row = [];
  					headerList.map(function(child) {
  						if(!(child in top)) {
  							row.push('');
  						}
  						else {
  							row.push(top[child]);
  						}
  					});
  					dataDict[sheetName].push(row);
  				});

  				headerDict[sheetName] = headerList;
   			});

   			ReactDOM.render(
   				<Panel header={<h3>Configure data</h3>} bsStyle="success">
      				<Row>
						<Col xs={12}>
							{workbook.SheetNames.map(function(result) {
								return <Panel key={result} header={<h3>{result}</h3>}>
									<GridViewer header={headerDict[result]} data={dataDict[result]} />
								</Panel>
							})}
						</Col>
					</Row>
    			</Panel>,
				document.getElementById('csv-xls-xlsx-importer-content')
			);

   		}.bind(this);
   		reader.readAsBinaryString(file);
	},

	handleFile: function(event) {
    	let input = event.target;

		let extension = input.files[0].name.split('.').pop();

		let json_result = {};

    	if(extension == "xlsx") {
    		this.viewXlsXlsx(input.files[0], XLSX);
    	}
    	else if(extension == "xls") {
    		this.viewXlsXlsx(input.files[0], XLS);
    	}
    	else if(extension == "csv") {
    		this.viewCsv(input.files[0]);
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