var Profile = React.createClass({
  	getInitialState: function() {
    	return {
      		username: '',
	      	password: '',
	      	token: '',
	      	tokens: '',
	      	id: '',
	      	role: ''
	    };
  	},

	login() {	
		$.ajax({
		    type: "post",
		    url: this.props.source,
		    data: JSON.stringify({phoneNumber: this.refs.username.getValue(), password: this.refs.password.getValue()}),
		    crossDomain: true,
		    contentType: 'application/json',
		    dataType: 'json',
		    headers: {
		    	'Content-Type': 'application/json'
		    },
		    success: function(data){
		    	if (this.isMounted()) {
		        	this.setState({
		            	token: $.cookie('toboxkey'),
		            	tokens: $.cookie('toboxskey'),
		            	id: data['id'],
		            	role: data['role']
		          	});
		          	ReactDOM.render(
  						<Index />,
  						document.getElementById('content')
					);
		        }
		    }.bind(this)
    	});
	},

	render: function() {
    	return (
    		<div id="auth-container">
    			<div id="auth-wrapper">
		    	<Row>
			    	<Col>
				      	<Well>
					      	<Row>
								<Col xs={12}>
									<Label>Login:</Label>
									<Input 
										type="text"
										value="79689854262"
										ref="username"
									/>
								</Col>
							</Row>
							<Row>
								<Col xs={12}>
									<Label>Password:</Label>
									<Input
										type="password"
										value="123456"
										ref="password"
									/>
								</Col>
							</Row>
							<Row>
								<Col xs={12}>
									<ButtonInput bsStyle="primary" onClick={this.login} >Login</ButtonInput>
								</Col>
							</Row>
						</Well>
					</Col>
				</Row>
				</div>
			</div>
    	);
  	}
});

ReactDOM.render(
	<Profile source='http://127.0.0.1/api/beta/auth/phone/login' />,
	document.getElementById('content')
);