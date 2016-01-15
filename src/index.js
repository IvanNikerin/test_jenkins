var React = require('react');
var ReactDOM = require('react-dom');

require('bootstrap/dist/css/bootstrap.css');
require('./css/custom-react-table.css');

var Content = require('./content');

require('./tobox-data');

ReactDOM.render(
	React.createElement(Content),
	document.getElementById('content')
);