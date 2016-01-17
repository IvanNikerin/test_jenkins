var $ = require('jquery');

var React = require('react');

var BootstrapTable = window.BootstrapTable;
var TableHeaderColumn = require('react-bootstrap-table').TableHeaderColumn;

var Nav = require('react-bootstrap').Nav;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var Panel = require('react-bootstrap').Panel;

module.exports = React.createClass({
    displayName: 'GridViewer',

    getInitialState: function() {
        var normalizedData = [];
        $.each(this.props.data, function(dataIndex, dataValue) {
            var nextData = {};
            Object.keys(this.props.products_relations[this.props.sheet]).map(function(header) {
                nextData[header] = dataValue[Object.keys(this.props.products_relations[this.props.sheet]).indexOf(header)];
            }.bind(this));
            normalizedData.push(nextData);
        }.bind(this));

        return {
            'products_relations': this.props.products_relations,
            'normalizedData': normalizedData,
            'sheet': this.props.sheet
        };
        /*var header = this.props.header.slice();
        header.splice(0, 0, "row");

        var tobox_header = {};

        for(var iter = 0; iter < header.length; iter ++) {
            tobox_header[header[iter]] = "Not selected";
        }

        var data = [];

        var isKey = {};

        for(var topIter = 0; topIter < this.props.data.length; topIter ++) {
            var nextDict = {};
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
        };*/
    },

    onNavClick: function(item, key) {
        /*var tobox_header = this.state.tobox_header;
        tobox_header[item] = key;

        this.setState({
            'tobox_header': tobox_header
        });*/
    },

    onProductsRelationSet: function(sheet, name, tobox) {
        var products_relations = this.state.products_relations;
        products_relations[sheet][name] = tobox;

        this.setState({
            'products_relations': products_relations
        });
    },

    onProductsClick: function(e) {
        var data = e.target.id.split('_');

        var sheet = data[0];
        var header = data[1];
        var id = data[2];

        var text = e.target.innerText;

        this.onProductsRelationSet(sheet, header, {title: text, id: id});
    },

    componentDidMount: function() {
    },

	render: function() {
		return (
            <BootstrapTable data={this.state.normalizedData} striped={true} hover={true} condensed={true} pagination={true}>
                {Object.keys(this.state.products_relations[this.state.sheet]).map(function(header) {
                    return <TableHeaderColumn isKey={Object.keys(this.state.products_relations[this.state.sheet]).indexOf(header) == 0} key={header} dataField={header}>
                        <Nav>
                            <NavDropdown id={header} title={header + " -> " + this.state.products_relations[this.state.sheet][header]['title']}>
                                {Object.keys(window.products).map(function(key) {
                                    return <MenuItem id={this.state.sheet + '_' + header + '_' + window.products[key]} key={key} onClick={this.onProductsClick}>{key}</MenuItem>
                                }.bind(this))}
                            </NavDropdown>
                        </Nav>
                    </TableHeaderColumn>
                }.bind(this))}
            </BootstrapTable>
        );
    }
});

//onClick={this.onNavClick.bind(this, result, key)}