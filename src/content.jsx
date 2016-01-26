var $ = require('jquery');
require('jquery.cookie');

var React = require('react');
var ReactDOM = require('react-dom');

var Tabs = require('react-bootstrap').Tabs;
var Tab = require('react-bootstrap').Tab;

var CsvXlsImporter = require('./csv-xls-importer');
var YmlImporter = require('./yml-importer');
var CategoriesRelations = require('./categories-relations');

module.exports = React.createClass({displayName: 'Content',
    getInitialState: function() {
        return {
            token: '',
            tokens: '',
            shopId: '',
            userId: ''
        };
    },

    getProfile: function() {
        $.ajax({
            type: "post",
            url: '/tobox/api/beta/profile',
            crossDomain: true,
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(data){
                this.setState({
                    shopId: data["shopIds"][0],
                    userId: data["userId"]
                });
                ReactDOM.render(
                    <Tabs defaultActiveKey={1}>
                        <Tab eventKey={1} title="Categories relations">
                            <CategoriesRelations userId={this.state.userId} shopId={this.state.shopId}/>
                        </Tab>
                        <Tab eventKey={2} title="YML importer">
                            <YmlImporter shopId={this.state.shopId} />
                        </Tab>
                        <Tab eventKey={3} title="CSV XLS XLSX importer">
                            <CsvXlsImporter userId={this.state.userId} shopId={this.state.shopId} token={this.state.token}/>
                        </Tab>
                    </Tabs>,
                    document.getElementById('main')
                );
            }.bind(this)
        });        
    },

    getCategories: function() {
        $.ajax({
            type: "get",
            url: '/tobox/api/beta/categories',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(data){
                window.categories = data;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },

    // TODO: this method must be removed - used just for tests
    login: function() {
        $.ajax({
            type: "post",
            url: '/tobox/api/beta/auth/phone/login',
            data: JSON.stringify({phoneNumber: '79689854262', password: '123456'}),
            crossDomain: true,
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(data){
                this.getProfile();
                this.getCategories();
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },

    componentDidMount: function() {
        // INFO: tests without cookie
        // this.login();

        this.getCategories();
        this.getProfile();
    },

	render: function() {
    	return (
    		<div id="main">
			</div>
    	);
  	}
});