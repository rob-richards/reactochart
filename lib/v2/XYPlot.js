'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _d3 = require('d3');

var _d32 = _interopRequireDefault(_d3);

var PropTypes = _react2['default'].PropTypes;

var XYPlot = _react2['default'].createClass({
    displayName: 'XYPlot',

    propTypes: {
        // (outer) width and height of the chart
        width: PropTypes.number,
        height: PropTypes.number,

        // chart margins
        marginTop: PropTypes.number,
        marginBottom: PropTypes.number,
        marginLeft: PropTypes.number,
        marginRight: PropTypes.number,

        // whether or not to draw the tick lines on the X axis
        shouldDrawXTicks: PropTypes.bool,
        // whether or not to draw X axis label text (dates)
        shouldDrawXLabels: PropTypes.bool,

        // whether or not to draw the tick lines on the Y axis
        shouldDrawYTicks: PropTypes.bool,
        // whether or not to draw Y axis label text (values)
        shouldDrawYLabels: PropTypes.bool,

        onMouseMove: PropTypes.func
    },
    getDefaultProps: function getDefaultProps() {
        return {
            width: 400,
            height: 250,
            marginTop: 10,
            marginBottom: 40,
            marginLeft: 60,
            marginRight: 10,
            shouldDrawXTicks: true,
            shouldDrawXLabels: true,
            shouldDrawYTicks: true,
            shouldDrawYLabels: true,
            onMouseMove: _lodash2['default'].noop
        };
    },
    getInitialState: function getInitialState() {
        return {
            xScale: null,
            yScale: null,
            innerWidth: null,
            innerHeight: null
        };
    },

    componentWillMount: function componentWillMount() {
        this.initScale(this.props);
        //this.initDataLookup(this.props);
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        this.initScale(newProps);
        //this.initDataLookup(newProps);
    },

    initScale: function initScale(props) {
        var innerWidth = props.width - (props.marginLeft + props.marginRight);
        var innerHeight = props.height - (props.marginTop + props.marginBottom);

        var childExtents = [];
        _react2['default'].Children.forEach(props.children, function (child) {
            var _child$props = child.props;
            var data = _child$props.data;
            var getX = _child$props.getX;
            var getY = _child$props.getY;

            childExtents.push(child.type.getExtent(data, getX, getY));
        });
        console.log('childExtents', childExtents);

        var xExtent = _d32['default'].extent(_lodash2['default'].flatten(_lodash2['default'].pluck(childExtents, 'x')));
        var yExtent = _d32['default'].extent(_lodash2['default'].flatten(_lodash2['default'].pluck(childExtents, 'y')));

        var xScale = _d32['default'].scale.linear().range([0, innerWidth]).domain(xExtent);

        var yScale = _d32['default'].scale.linear().range([innerHeight, 0])
        // get the max/min for each dataset we're plotting, then the overall max/min of all of them
        .domain(yExtent)
        // extend domain to start/end at nice round values
        .nice();

        this.setState({ xScale: xScale, yScale: yScale, innerWidth: innerWidth, innerHeight: innerHeight });
    },

    onMouseMove: function onMouseMove(e) {
        //if(!this.props.onMouseMove && !this.state.isSelecting) return;

        var chartBB = e.currentTarget.getBoundingClientRect();
        var chartX = e.clientX - chartBB.left - this.props.marginLeft;
        var chartXVal = this.state.xScale.invert(chartX);

        var hovered = this.refs['chart-series-0'].getHovered(chartXVal);

        this.props.onMouseMove(hovered, e);

        //const closestDataIndex = this.state.bisectDate(this.props.data, chartXVal);

        //if(this.props.onMouseMove)
        //    this.props.onMouseMove(this.props.data[closestDataIndex], closestDataIndex, e);
        //
        //if(!this.state.isSelecting) return;
        //
        //if(chartDate > this.props.selectedRangeMin)
        //    this.props.onChangeSelectedRange(this.props.selectedRangeMin, chartDate, true);
        //else
        //    this.props.onChangeSelectedRange(chartDate, this.props.selectedRangeMin, true);
    },

    render: function render() {
        var _props = this.props;
        var width = _props.width;
        var height = _props.height;
        var marginLeft = _props.marginLeft;
        var marginTop = _props.marginTop;
        var _state = this.state;
        var xScale = _state.xScale;
        var yScale = _state.yScale;
        var innerWidth = _state.innerWidth;
        var innerHeight = _state.innerHeight;

        return _react2['default'].createElement(
            'svg',
            _extends({ className: 'multi-chart' }, { width: width, height: height }, {
                onMouseMove: this.onMouseMove
            }),
            _react2['default'].createElement(
                'g',
                { className: 'chart-inner',
                    transform: 'translate(' + marginLeft + ', ' + marginTop + ')'
                },
                this.renderXAxis(),
                this.renderYAxis(),
                _react2['default'].Children.map(this.props.children, function (child, i) {
                    var name = child.props.name || 'chart-series-' + i;
                    return _react2['default'].cloneElement(child, { ref: name, name: name, xScale: xScale, yScale: yScale, innerWidth: innerWidth, innerHeight: innerHeight });
                    //return child;
                })
            )
        );
    },
    renderXAxis: function renderXAxis() {
        var _props2 = this.props;
        var shouldDrawXTicks = _props2.shouldDrawXTicks;
        var shouldDrawXLabels = _props2.shouldDrawXLabels;

        if (!(shouldDrawXTicks || shouldDrawXLabels)) return null;
        var _state2 = this.state;
        var xScale = _state2.xScale;
        var innerHeight = _state2.innerHeight;

        var xTicks = xScale.ticks();

        return _react2['default'].createElement(
            'g',
            { className: 'chart-axis chart-axis-x', transform: 'translate(0, ' + innerHeight + ')' },
            _lodash2['default'].map(xTicks, function (x) {
                return _react2['default'].createElement(
                    'g',
                    { transform: 'translate(' + xScale(x) + ', 0)' },
                    shouldDrawXTicks ? _react2['default'].createElement('line', { className: 'chart-tick chart-tick-x', x2: 0, y2: 6 }) : null,
                    shouldDrawXLabels ? _react2['default'].createElement(
                        'text',
                        { className: 'chart-axis-label chart-x-label', dy: '0.8em', y: '9' },
                        x + ""
                    ) : null
                );
            })
        );
    },
    renderYAxis: function renderYAxis() {
        var _props3 = this.props;
        var shouldDrawYTicks = _props3.shouldDrawYTicks;
        var shouldDrawYLabels = _props3.shouldDrawYLabels;

        if (!(shouldDrawYTicks || shouldDrawYLabels)) return null;
        var _state3 = this.state;
        var yScale = _state3.yScale;
        var innerWidth = _state3.innerWidth;

        var yTicks = yScale.ticks();

        return _react2['default'].createElement(
            'g',
            { className: 'chart-axis chart-axis-y' },
            _lodash2['default'].map(yTicks, function (value) {
                return _react2['default'].createElement(
                    'g',
                    { transform: 'translate(0, ' + yScale(value) + ')' },
                    shouldDrawYTicks ? _react2['default'].createElement('line', { className: 'chart-tick chart-tick-y', x2: innerWidth, y2: 0 }) : null,
                    shouldDrawYLabels ? _react2['default'].createElement(
                        'text',
                        { className: 'chart-axis-label chart-y-label', dy: '0.32em', x: -3 },
                        value
                    ) : null
                );
            })
        );
    }
});

exports['default'] = XYPlot;
module.exports = exports['default'];