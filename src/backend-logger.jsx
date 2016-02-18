var $ = require('jquery');

var React = require('react');
var ReactDOM = require('react-dom');

var Panel = require('react-bootstrap').Panel;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Table = require('react-bootstrap').Table;
var ProgressBar = require('react-bootstrap').ProgressBar;

var BackendLogger = require('./backend-logger');

module.exports = React.createClass({
	displayName: 'BackendLogger',

	getInitialState: function() {
        return ({
        	'user_id': this.props.userId,
        	'is_need_process': true,
        	'processing_progress_id': this.props.processing_progress_id,
        	'processing_container_id': this.props.processing_container_id,
        	'processing_stats_id': this.props.processing_stats_id,
        	'file_name': this.props.file_name,
        	'stats': {'uploaded': 0, 'updated': 0, 'failed': 0},
        	'is_processing': this.props.is_processing
        });
    },

	componentDidMount: function() {
		this.processing();
		ReactDOM.render(<ProgressBar now={0} label="%(percent)s%" />, document.getElementById(this.state.processing_progress_id));
	},

	clearLog: function() {
		$.ajax({
	    	type: 'post',
	    	url: '/importer/api/tasks/',
	    	data: {user_id: this.state.user_id, file_name: this.state.file_name}
   		});
   		window.processing_upload = false;
	},

	renderStatus: function(log, data) {
		var stats = this.state.stats;

	    if(data['has_error']) {
	    	stats['failed'] += 1;
	    }

	    var now = data['current_iteration'] / data['iterations'] * 100;
	    ReactDOM.render(<ProgressBar now={now | 0} label="%(percent)s%" />, document.getElementById(this.state.processing_progress_id));
		var html = [];

		var uploaded = 0;
		var updated = 0;

		log.map(function(element) {
			$.each(element, function(key, value) {
				if (value[0] == 'product_uploading_success')
				{
					uploaded += 1;
				}
				else if (value[0] == 'product_updating_success')
				{
					updated += 1;
				}

				var r = /\\u([\d\w]{4})/gi;
				x = value[1].replace(r, function (match, grp) {
    			return String.fromCharCode(parseInt(grp, 16)); } );
				x = unescape(x);
				html.push(
					<tr key={key}>
						<td>
							{key}
								</td>
									<td>
										{window.translate(value[0])}
									</td>
									<td>
										{x}
									</td>
								</tr>
							);
						})
					});

				stats['uploaded'] = uploaded;
				stats['updated'] = updated;

				this.setState({
					'stats': stats
				});

   				ReactDOM.render(
   					<Table className="scrolled-table" striped bordered condensed hover>
   						<thead>
   							<tr>
    							<th>
    								{window.translate('time')}
    							</th>
    							<th>
    								{window.translate('message')}
    							</th>
    							<th>
    								{window.translate('data')}
    							</th>
   							</tr>
   						</thead>
   						<tbody className="scrolled-tbody">
   							{html}
   						</tbody>
   					</Table>,
   					document.getElementById(this.state.processing_container_id)
		);
	},

	processing: function() {
		window.processing_upload = true;
		$.ajax({
	    	type: 'get',
	    	url: '/importer/api/tasks/',
	    	dataType: 'json',
	    	data: {user_id: this.state.user_id, file_name: this.state.file_name},
	    	success: function(data){
	    		if (Object.keys(data).length === 0) {
	    		}
	    		else {
	    			var log = JSON.parse(data['log'])
	    			var code = log[log.length - 1][Object.keys(log[log.length - 1])[0]][0];
	    			if (code == 'finish'){
	    				this.setState({
	    					'is_need_process': false
	    				});
	    				ReactDOM.render(<ProgressBar now={100} label="%(percent)s%" />, document.getElementById(this.state.processing_progress_id));
	    				this.renderStatus(log, data);
	    				this.clearLog();

	    				this.state.is_processing(false);
	    			}
	    			else {
	    				this.renderStatus(log, data);
	    			}
	    		}
	    	}.bind(this)
   		});

		if (this.state.is_need_process)
		{
			setTimeout(this.processing, 1000);
		}

		/*<Panel header={<h3>{window.translate('status')}</h3>} bsStyle="primary">
	    			<Row>
						<Col xs={12}>
							<div id='progress-container'></div>
						</Col>
					</Row>
    			</Panel>*/
	},

	render: function() {
    	return (
    		<Panel header={<h3>{window.translate('status')}</h3>} bsStyle="primary">
	    		<Row>
					<Col xs={12}>
					</Col>
					<Col xs={12}>
						<div id={this.state.processing_progress_id}>
						</div>
						<div id={this.state.processing_stats_id}>
							{window.translate('uploaded') + ': ' + this.state.stats['uploaded']}
							<br></br>
							{window.translate('updated') + ': ' + this.state.stats['updated']}
							<br></br>
							{window.translate('failed') + ': ' + this.state.stats['failed']}
							<br></br>
						</div>
						<div id={this.state.processing_container_id}>
						</div>
					</Col>
				</Row>
    		</Panel>
    	);
    }
})