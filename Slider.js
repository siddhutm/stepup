import React from 'react';
import _ from 'underscore';
import classNames from 'classnames';
const sliderFullWidth = 200, minWidth = 15,
	Keys = {
		LEFT : 37,
		RIGHT : 39
	},
	Handle = {
		LEFT: 'left',
		RIGHT: 'right'
	};

class Slider extends React.Component {

	constructor(props) {
		super(props);
		this.defaultPropsData = {
			rangeMin: 0,
			hasMaxHandle : false,
			step : 1
		};
		this.bound = {
			onMouseMove : this.onMouseMove.bind(this),
			onTrackMouseUp : this.onTrackMouseUp.bind(this),
			onTrackMouseDown : this.onTrackMouseDown.bind(this),
			onHandleKeyDown : this.onHandleKeyDown.bind(this)
		};
	}

	render() {
		this.processPropsData();
		var props = this.propsData;
		return (	
			<div className="sliderContainer">
				<div className="sliderName">{ props.label }</div>
				<div ref="slider" className="slider"  onMouseDown={ this.bound.onTrackMouseDown }>
					<div className="sliderTrackContainer">
						{ this.renderSliderTrack() }
						{ this.renderLeftHandle() }
						{ props.hasMaxHandle ? this.renderRightHandle() : this.renderRightHandleToolTip() }
					</div>
				</div>
			</div>
		);
	}

	processPropsData() {
		this.propsData = _.extend({}, this.defaultPropsData, this.props);
		var propsData = this.propsData,
			beginStyle, endStyle, sliderWidth;
		propsData.valueMin = propsData.valueMin || propsData.rangeMin;
		propsData.valueMax = propsData.valueMax || propsData.rangeMax;
		beginStyle = this.getBeginStyle();
		endStyle = this.getEndStyle();
		sliderWidth = this.getSliderWidth(beginStyle, endStyle);	
		this.style = {
			beginStyle : beginStyle,
			endStyle : endStyle,
			sliderWidth: sliderWidth
		};
	}

	renderLeftHandle() {
		var props = this.propsData,
			tooltip = props.valueMin,
			leftStyle = {
				left : this.style.beginStyle + '%'
			};
		return this.getHandleMarkup('handle', Handle.LEFT, leftStyle, tooltip);
	}

	renderRightHandle() {
		var endHandleClasses = classNames({
				handle : true,
				hide : !this.propsData.hasMaxHandle 
			}),
			props = this.propsData,
			rightStyle = {
				left : this.style.endStyle + '%'
			},
			tooltip = props.valueMax;
		return this.getHandleMarkup(endHandleClasses, Handle.RIGHT, rightStyle, tooltip);
	}

	getHandleMarkup(classes, handle, handleStyle, tooltip) {
		var allowedMinValue, allowedMaxValue,
			props = this.propsData;
		if (handle === Handle.LEFT) {
			allowedMinValue = props.rangeMin;
			allowedMaxValue = props.valueMax;
		} else {
			allowedMinValue = props.valueMin;
			allowedMaxValue = props.rangeMax;
		}
		return (
			<span className="handleContainer">
				<span className="handleTooltip" style={ handleStyle }>
					{ tooltip }
				</span>
				<a ref={ handle } className={ classes } style={ handleStyle } href="javascript:void(0)" data-handle={ handle } data-allowedmin={ allowedMinValue } data-allowedmax={ allowedMaxValue } onMouseDown={ this.onHandleMouseDown.bind(this) } onKeyDown={ this.bound.onHandleKeyDown }>
					<span className="innerCircle"></span>
				</a>
			</span>
		);
	}

	renderRightHandleToolTip() {
		return (
			<span className='rightHandleTooltipAlone'>
				{ this.propsData.valueMax }
			</span>
		);
	}	

	renderSliderTrack() {
		var style = this.style,
			sliderTrackPosition = style.beginStyle,
			sliderTrackWidth = style.sliderWidth,
			sliderTrackStyle= {
				left : sliderTrackPosition + '%',
				width : sliderTrackWidth + '%'
			};
		return (
			<div className="sliderTrack" style={ sliderTrackStyle }> </div>
		);
	}

	getBeginStyle(value) {
		var props = this.propsData,
			newPosition, valueMin = value || props.valueMin ;
		newPosition =  (sliderFullWidth * valueMin) / props.rangeMax;
		return Math.round((newPosition *100) / sliderFullWidth);
	}

	getEndStyle(value) {
		var props = this.propsData,
			newPosition, percentage, valueMax = value || props.valueMax;
		newPosition =  (sliderFullWidth * valueMax) / props.rangeMax;
		percentage = Math.round(((sliderFullWidth - newPosition) * 100)  / sliderFullWidth);
		return (100 - percentage);
	}

	// keeps track which handle is clicked/selected
	onHandleMouseDown(event) {
		this.selectedHandle = event.currentTarget.dataset.handle;
	}

	onHandleKeyDown(event) {
		var handle = event.currentTarget.dataset.handle;
		switch (event.keyCode) {
			case Keys.LEFT:
				this.decrementValue(handle);
				break;

			case Keys.RIGHT:
				this.incrementValue(handle);
				break;

			default:
				break;
		}
	}

	decrementValue(handle) {
		var data, props = this.propsData, canUpdate;
		if(handle === Handle.LEFT) {
			data = {
				valueMin : props.valueMin - props.step,
				valueMax : props.valueMax
			};
			canUpdate = this.canUpdate(data.valueMin, data.valueMin, data.valueMax);
		} else {
			data = {
				valueMin : props.valueMin,
				valueMax : props.valueMax - props.step
			};
			canUpdate = this.canUpdate(data.valueMax, data.valueMin, data.valueMax);
		}
		if (data && canUpdate) {
			this.updatePositons(null, data);
		}
	}

	incrementValue(handle) {
		var data, props = this.propsData, canUpdate;
		if(handle === Handle.LEFT) {
			data = {
				valueMin : props.valueMin + props.step,
				valueMax : props.valueMax
			};
			canUpdate = this.canUpdate(data.valueMin, data.valueMin, data.valueMax);
		} else {
			data = {
				valueMin : props.valueMin,
				valueMax : props.valueMax + props.step
			};
			canUpdate = this.canUpdate(data.valueMax, data.valueMin, data.valueMax);
		}
		if (data && canUpdate) {
			this.updatePositons(null, data);
		}
	}

	canUpdate(newValue, valueMin, valueMax) {
		var beginStyle, endStyle, sliderWidth;
		beginStyle = this.getBeginStyle(valueMin);
		endStyle = this.getEndStyle(valueMax);
		sliderWidth = this.getSliderWidth(beginStyle, endStyle);
		return this.propsData.hasMaxHandle ? (sliderWidth >= minWidth) && this.isValid(newValue) : this.isValid(newValue);
	}

	onTrackMouseDown(event) {
		var slider = this.refs.slider;
		document.addEventListener('mouseup', this.bound.onTrackMouseUp);
		slider.addEventListener('mousemove', this.bound.onMouseMove);
		this.handleSliderMove(event);
	}

	onTrackMouseUp() {
		var slider = this.refs.slider;
		document.removeEventListener('mouseup', this.bound.onTrackMouseUp);
		slider.removeEventListener('mousemove', this.bound.onMouseMove);
		this.selectedHandle = null;
	}

	onMouseMove(event) {
		this.handleSliderMove(event);	
	}

	handleSliderMove(event) {
		event.preventDefault();
		var newData = this.getNewData(event);
		if (this.isValid(newData.newValue)) {
			this.updatePositons(newData);
		}
	}

	isValid(value) {
		var props = this.propsData;
		return !(value < props.rangeMin || value > props.rangeMax);
	}

	getNewData(event) {
		var relativeX, 
			currentEl = event.currentTarget, newValue;
		relativeX = Math.round(event.pageX - currentEl.offsetLeft);
		newValue = (this.propsData.rangeMax * relativeX) / sliderFullWidth;
		return {
			newValue : Math.round(newValue),
			newPosition : relativeX
		};
	}

	updatePositons(data, values) {
		var props = this.propsData;
		if(!values) {
			var newValue = data.newValue,
				handle =  this.getHandle(newValue),
				updatedData;
			if (handle === 'min') {
				updatedData = this.getValuesOnMinChange(data.newPosition, newValue);
			} else {
				updatedData = this.getValuesOnMaxChange(data.newPosition, newValue);
			}
			updatedData.newValue = newValue;
			if (!this.shouldUpdate(updatedData)) {
				return;
			}
			props.onChange(props.key, updatedData.valueMin, updatedData.valueMax);
		} else {
			props.onChange(props.key, values.valueMin, values.valueMax);
		}	
	}

	getValuesOnMinChange(newPosition, newValue) {
		var percentage, sliderWidth, beginStyle;
		percentage = Math.round( (newPosition *100) / sliderFullWidth);
		beginStyle = percentage > 100 ? 100 : percentage;
		sliderWidth = this.getSliderWidth(beginStyle, this.style.endStyle);
		return {
			valueMin : newValue,
			valueMax : this.propsData.valueMax,
			sliderWidth : sliderWidth
		};
	}

	getValuesOnMaxChange(newPosition, newValue) {
		var percentage, sliderWidth, endStyle;
		percentage = Math.round( ((sliderFullWidth - newPosition) * 100)  / sliderFullWidth);
		endStyle = 100 - percentage;
		sliderWidth = this.getSliderWidth(this.style.beginStyle, endStyle);
		return {
			valueMin : this.propsData.valueMin,
			valueMax : newValue,
			sliderWidth : sliderWidth
		};	
	}

	shouldUpdate(updatedData) {
		return this.propsData.hasMaxHandle ? this.canHandlesMove(updatedData) : true;
	}

	// This method checks the left handle should not cross over the right handle and vice versa.
	canHandlesMove(updatedData) {
		if (updatedData.sliderWidth >= minWidth) {
			var allowedMin, allowedMax;
			// if any handle is clicked/selected then only it validates the cross-over
			if (this.selectedHandle) {
				if (this.selectedHandle === Handle.LEFT) {
					allowedMax = this.refs.left.dataset.allowedmax;
					return !(updatedData.newValue > allowedMax);
				}
				else {
					allowedMin = this.refs.right.dataset.allowedmin;
					return !(updatedData.newValue < allowedMin);
				}
			}
			return true;
		}
		return false;	
	}

	getHandle(value) {
		var props = this.propsData,
			range, modifiedRange;
		range = props.valueMax - props.valueMin;
		modifiedRange = (range/2 + props.valueMin);

		if (value > modifiedRange && props.hasMaxHandle) {
			if (this.selectedHandle && this.selectedHandle === Handle.LEFT) {
				return 'min';			
			}
			return 'max';
		} else {
			if (this.selectedHandle && this.selectedHandle === Handle.RIGHT) {
				return 'max';			
			} 
			return 'min';	
		}
	}

	getSliderWidth(minValue, maxValue) {
		return maxValue - minValue;
	}
}

Slider.propTypes = {
	key : React.PropTypes.string.isRequired,
	label: React.PropTypes.string.isRequired,
	rangeMin: React.PropTypes.number,
	rangeMax: React.PropTypes.number.isRequired,
	valueMin: React.PropTypes.number, 
	valueMax: React.PropTypes.number,
	hasMaxHandle : React.PropTypes.bool,
	onChange: React.PropTypes.func.isRequired
};

export default Slider;
