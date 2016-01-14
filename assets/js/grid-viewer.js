window.GridViewer = React.createClass({
    getInitialState: function() {
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
        return {
            'header': header,
            'data': data,
            'isKey': isKey,
            'tobox_header': tobox_header
        };
    },

    onNavClick: function(item, key) {
        let tobox_header = this.state.tobox_header;
        tobox_header[item] = key;

        this.setState({
            'tobox_header': tobox_header
        });
    },

    componentDidMount: function() {
    },

	render: function() {
		return (
            <BootstrapTable data={this.state.data} striped={true} hover={true} condensed={true} pagination={true}>
			    {this.state.header.map(function(result) {
				return <TableHeaderColumn isKey={this.state.isKey[result]} key={result} dataField={result}>
                        <Nav>
                            <NavDropdown id={result} title={result + " -> " + this.state.tobox_header[result]}>
                                {Object.keys(window.products).map(function(key) {
                                    return <MenuItem key={key} onClick={this.onNavClick.bind(this, result, key)}>{key}</MenuItem>
                                }.bind(this))}
                            </NavDropdown>
                        </Nav>
                    </TableHeaderColumn>
			    }.bind(this))}
            </BootstrapTable>
		);
	}
});