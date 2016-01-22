var React = require('react');
var ReactDOM = require('react-dom');

require('./css/react-bootstrap-table-all.css');
require('./css/custom-bootstrap-form.css');
require('./css/darkly.min.css');
require('./css/custom.css');
require('./react-bootstrap-table');

var Content = require('./content');

require('./tobox-data');

ReactDOM.render(
	React.createElement(Content),
	document.getElementById('content')
);