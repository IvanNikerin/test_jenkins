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
var Button = require('react-bootstrap').Button;

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
            phoneNumber: '79689854262',
            password: '123456'
        };
    },

    updateToken: function(userId) {
        $.ajax({
            type: 'post',
            url: '/importer/api/tobox/auth/',
            data: { user_id: userId, token: $.cookie('toboxkey') }
        });
    },
	
	clickTobox: function() {
		document.getElementById('toboxId').click();
	},
	
	clickSeller: function() {
		document.getElementById('sellerId').click();
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
						<Row>
							<Col xs={12}>
								<a id="toboxId" href="http://tobox.com" className="displaynone"></a>
								<a id="sellerId" href="/seller" className="displaynone"></a>
								<Button onClick={this.clickTobox} className="pull-right tobox-button" bsStyle="info">ToBox</Button>
								<Button onClick={this.clickSeller} className="pull-right seller-button" bsStyle="default">Seller</Button>
							</Col>

						</Row>

                        <Tabs defaultActiveKey={1}>
                            <Tab eventKey={1} title={window.translate("categories_relations")}>
                                <CategoriesRelations userId={this.state.userId} shopId={this.state.shopId}/>
                            </Tab>
                            <Tab eventKey={2} title={"YML " + window.translate('importer')}>
                                <YmlImporter shopId={this.state.shopId} />
                            </Tab>
                            <Tab eventKey={3} title={"CSV XLS XLSX " + window.translate('importer')}>
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
        var username = this.state.phoneNumber;
        var password = this.state.password;

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

    onChangePhone: function() {
        this.setState({
            phoneNumber: this.refs.phone.getValue()
        });
    },

    onChangePassword: function() {
        this.setState({
            password: this.refs.password.getValue()
        });
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
                                            <Label>{window.translate('login')}:</Label>
                                            <Input 
                                                type="text"
                                                value={this.state.phoneNumber}
                                                ref="phone"
                                                onChange={this.onChangePhone}
                                            />
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col >
                                           <Label>{window.translate('password')}</Label>
                                           <Input
                                               type="password"
                                               value={this.state.password}
                                               ref="password"
                                               onChange={this.onChangePassword}
                                           />
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col >
                                           <ButtonInput bsStyle="primary" onClick={this.login} >{window.translate('login_button')}</ButtonInput>
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