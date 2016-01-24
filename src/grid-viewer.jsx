var $ = require('jquery');

var React = require('react');

var BootstrapTable = window.BootstrapTable;
var TableHeaderColumn = require('react-bootstrap-table').TableHeaderColumn;

var Nav = require('react-bootstrap').Nav;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var Panel = require('react-bootstrap').Panel;
var DropdownButton = require('react-bootstrap').DropdownButton;

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

        var products_dict = Object.assign({'not selected':-1}, window.products);
        var product_params = Object.keys(window.products);
        product_params.push('Категория');
        product_params.unshift('not selected');

        var primary_dict = {};

        Object.keys(this.props.products_relations[this.props.sheet]).map(function(header) {
            primary_dict[header] = false;
        }.bind(this));

        return {
            'products_relations': this.props.products_relations,
            'normalizedData': normalizedData,
            'sheet': this.props.sheet,
            'product_params_dict': products_dict,
            'product_params': product_params,
            'primary_dict': primary_dict
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

        var product_params = this.state.product_params;
        
        if(text != 'not selected') {
            var ids = e.target.parentElement.childNodes[0].id.split('_');
            var title = this.state.products_relations[ids[0]][ids[1]]['title'];

            /*if(title == 'not selected')
            {
                product_params.splice(product_params.indexOf(text),1);
            }
            else {
                product_params.splice(product_params.indexOf(text),1);
                if(title != text)
                    product_params.push(this.state.products_relations[ids[0]][ids[1]]['title']);
            }*/
        }
        else {
            var ids = e.target.parentElement.childNodes[0].id.split('_');
            var title = this.state.products_relations[ids[0]][ids[1]]['title'];
            /*if(title != text)
                product_params.push(this.state.products_relations[ids[0]][ids[1]]['title']);*/
        }

        /*this.setState({
            'product_params': product_params
        });*/

        if(text == 'Категория') {
            id = 'category';
        }


        this.onProductsRelationSet(sheet, header, {title: text, id: id, 'is_primary': this.state.primary_dict[header]});
    },

    onPrimaryClick: function(e) {
        var primary_dict = this.state.primary_dict;
        var products_relations = this.state.products_relations;

        Object.keys(primary_dict).map(function(key){
            primary_dict[key] = false;
        });

        primary_dict[e.target.text] = true;

        Object.keys(products_relations[this.state.sheet]).map(function(header) {
            if(primary_dict[header])
            {
                products_relations[this.state.sheet][header]['is_primary']=true;
            }
            else {
                products_relations[this.state.sheet][header]['is_primary']=false;
            }
        }.bind(this));

        this.setState({
            'products_relations': products_relations,
            'primary_dict': primary_dict
        })
    },

    componentDidMount: function() {        
    },

	render: function() {
        var primary_keys_list = [];
        var primary_text = ": not selected";

        Object.keys(this.state.products_relations[this.state.sheet]).map(function(header) {
            if(this.state.products_relations[this.state.sheet][header]['id'] != -1 &&
                this.state.products_relations[this.state.sheet][header]['title'] != 'Категория') {
                if(this.state.products_relations[this.state.sheet][header]['is_primary']) {
                    this.state.primary_dict[header] = true;
                    primary_text = ": " + header;
                }
                primary_keys_list.push(<MenuItem key={header} onClick={this.onPrimaryClick} value={header}>{header}</MenuItem>);
            }
        }.bind(this));

		return (
            <div>
                <DropdownButton title={"Primary key" + primary_text} id="bg-nested-dropdown">
                    {primary_keys_list}
                </DropdownButton>
                <BootstrapTable data={this.state.normalizedData} striped={true} hover={true} condensed={true} pagination={true}>
                    {Object.keys(this.state.products_relations[this.state.sheet]).map(function(header) {
                        return <TableHeaderColumn isKey={Object.keys(this.state.products_relations[this.state.sheet]).indexOf(header) == 0} key={header} dataField={header}>
                            <Nav>
                                <NavDropdown id={header} title={header + " -> " + this.state.products_relations[this.state.sheet][header]['title']}>
                                    {this.state.product_params.map(function(key) {
                                        return <MenuItem id={this.state.sheet + '_' + header + '_' + this.state.product_params_dict[key]} key={key} onClick={this.onProductsClick}>{key}</MenuItem>
                                    }.bind(this))}
                                </NavDropdown>
                            </Nav>
                        </TableHeaderColumn>
                    }.bind(this))}
                </BootstrapTable>
            </div>
        );
    }
});

//onClick={this.onNavClick.bind(this, result, key)}