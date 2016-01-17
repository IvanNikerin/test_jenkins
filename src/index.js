var React = require('react');
var ReactDOM = require('react-dom');

require('bootstrap/dist/css/bootstrap.css');
require('./css/react-bootstrap-table-all.css');

require('./react-bootstrap-table');

var Content = require('./content');

require('./tobox-data');

ReactDOM.render(
	React.createElement(Content),
	document.getElementById('content')
);