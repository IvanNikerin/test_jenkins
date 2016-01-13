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
            url: 'http://127.0.0.1/tobox/api/beta/profile',
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

    getCategories() {
        $.ajax({
            type: "get",
            url: 'http://127.0.0.1/tobox/api/beta/categories',
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

    login() {   
        $.ajax({
            type: "post",
            url: 'http://127.0.0.1/tobox/api/beta/auth/phone/login',
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

                    this.getCategories();
                }
                alert(JSON.stringify(data));
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