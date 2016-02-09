var $ = require('jquery');
require('jquery.cookie');

var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');

var Tabs = require('react-bootstrap').Tabs;
var Tab = require('react-bootstrap').Tab;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Well = require('react-bootstrap').Well;
var Label = require('react-bootstrap').Label;
var Input = require('react-bootstrap').Input;
var ButtonInput = require('react-bootstrap').ButtonInput;

var CsvXlsImporter = require('./csv-xls-importer');
var YmlImporter = require('./yml-importer');
var CategoriesRelations = require('./categories-relations');

module.exports = React.createClass({displayName: 'Content',
    getInitialState: function() {
        return {
            token: '',
            tokens: '',
            shopId: '',
            userId: '',
            modalIsOpen: false,
            phoneNumber: '',
            password: ''
        };
    },

    updateToken: function(userId) {
        $.ajax({
            type: 'post',
            url: '/importer/api/tobox/auth/',
            data: { user_id: userId, token: $.cookie('toboxkey') }
        });
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
                this.updateToken(data['userId']);

                this.setState({
                    shopId: data["shopIds"][0],
                    userId: data["userId"]
                });
                ReactDOM.render(
                    <div>
                        <Tabs defaultActiveKey={1}>
                            <Tab eventKey={1} title="Categories relations">
                                <CategoriesRelations userId={this.state.userId} shopId={this.state.shopId}/>
                            </Tab>
                            <Tab eventKey={2} title="YML importer">
                                <YmlImporter shopId={this.state.shopId} />
                            </Tab>
                            <Tab eventKey={3} title="CSV XLS XLSX importer">
                                <CsvXlsImporter userId={this.state.userId} shopId={this.state.shopId}/>
                            </Tab>
                        </Tabs>
                    </div>,
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
                this.getProfile();
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                this.setState({
                    modalIsOpen: true
                })
            }.bind(this)
        });
    },

    login: function() {
        var username = this.refs.username.props.value;
        var password = this.refs.password.props.value;

        $.ajax({
            type: "post",
            url: '/tobox/api/beta/auth/phone/login',
            data: JSON.stringify({phoneNumber: username, password: password}),
            crossDomain: true,
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(data){
                this.setState({
                    modalIsOpen: false
                });
                this.getCategories();
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },

    componentDidMount: function() {
        if ($.cookie('toboxkey')) {
            this.getCategories();
        }
        else {
            this.setState({
                modalIsOpen: true
            });
        }
    },

    onChange: function() {

    },

	render: function() {
    	return (
            <div>
        		<div id="main">
    			</div>
                <div>
                    <Modal isOpen={this.state.modalIsOpen} onRequest={this.onDialogClose}>
                        <Row>
                            <Col xsOffset={3} xs={6}>
                                <Well>
                                    <Row>
                                        <Col >
                                            <Label>Login:</Label>
                                            <Input 
                                                type="text"
                                                value="79689854262"
                                                ref="username"
                                                onChange={this.onChange}
                                            />
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col >
                                           <Label>Password:</Label>
                                           <Input
                                               type="password"
                                               value="123456"
                                               ref="password"
                                               onChange={this.onChange}
                                           />
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col >
                                           <ButtonInput bsStyle="primary" onClick={this.login} >Login</ButtonInput>
                                       </Col>
                                   </Row>
                               </Well>
                            </Col>
                        </Row>
                    </Modal>
                </div>
            </div>
    	);
  	}
});