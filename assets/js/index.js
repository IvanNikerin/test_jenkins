window.Index = React.createClass({
    getInitialState: function() {
        return {
            token: '',
            tokens: '',
            shopId: ''
        };
    },

    getShop() {
        $.ajax({
            type: "post",
            url: 'http://127.0.0.1/api/beta/profile',
            crossDomain: true,
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(data){
                if (this.isMounted()) {
                    this.setState({
                        shopId: data["shopIds"][0]
                    });
                }
            }.bind(this)
        });        
    },

    login() {   
        $.ajax({
            type: "post",
            url: 'http://127.0.0.1/api/beta/auth/phone/login',
            data: JSON.stringify({phoneNumber: '79689854262', password: '123456'}),
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
                        tokens: $.cookie('toboxskey')
                    });

                    this.getShop();
                }
            }.bind(this)
        });
    },

    componentDidMount: function() {
        this.login();
    },

	render: function() {
    	return (
    		<div>
    			<Tabs defaultActiveKey={2}>
					<Tab eventKey={1} title="YML importer">YML importer</Tab>
    				<Tab eventKey={2} title="CSV XLS XLSX importer">
    					<CsvXlsXlsxImporter shopId={this.state.shopId}/>
    				</Tab>
    			</Tabs>
			</div>
    	);
  	}
});

ReactDOM.render(
	<Index />,
	document.getElementById('content')
);