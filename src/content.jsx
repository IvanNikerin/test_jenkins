var $ = require('jquery');
require('jquery.cookie');

var React = require('react');

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
                if (this.isMounted()) {
                    this.setState({
                        shopId: data["shopIds"][0],
                        userId: data["userId"]
                    });
                }
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

    processTobox: function() {
        this.getProfile();
        this.getCategories();
    },

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
                /*if (this.isMounted()) {
                    this.setState({
                        token: $.cookie('toboxkey'),
                        tokens: $.cookie('toboxskey')
                    });

                    this.processTobox();
                }*/
                this.getCategories();
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },

    componentDidMount: function() {
        this.login();
    },

	render: function() {
    	return (
    		<div>
    			<Tabs defaultActiveKey={1}>
					<Tab eventKey={1} title="YML importer">
						<YmlImporter shopId={this.state.shopId} />
					</Tab>
    				<Tab eventKey={2} title="CSV XLS XLSX importer">
    					<CsvXlsImporter userId={this.state.userId} shopId={this.state.shopId} token={this.state.token}/>
    				</Tab>
                    <Tab eventKey={3} title="Categories relations">
                        <CategoriesRelations />
                    </Tab>
    			</Tabs>
			</div>
    	);
  	}
});