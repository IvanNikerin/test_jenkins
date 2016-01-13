window.GridViewer = React.createClass({
  componentDidMount: function() {
  },

	render: function() {
  	let header = this.props.header.slice();
  	header.splice(0, 0, "row");

    let tobox_header = {};

    for(var iter = 0; iter < header.length; iter ++) {
      tobox_header[header[iter]] = "Not selected";
    }

  	let data = [];

  	let isKey = {};

  	for(var topIter = 0; topIter < this.props.data.length; topIter ++) {
  		let nextDict = {};
  		this.props.data[topIter].splice(0, 0, topIter);
  		for(var iter = 0; iter < header.length; iter++) {

  			nextDict[header[iter]] = this.props.data[topIter][iter];
  			if(header[iter].indexOf("row") > -1)
  				isKey[header[iter]] = true;
  			else
  				isKey[header[iter]] = false;
  		}
  		data.push(nextDict);
  	}

		return (
			<BootstrapTable data={data} striped={true} hover={true} condensed={true} pagination={true}>
				{header.map(function(result) {
					return <TableHeaderColumn isKey={isKey[result]} key={result} dataField={result}>{result}
          </TableHeaderColumn>
				})}
			</BootstrapTable>
		);
	}
});