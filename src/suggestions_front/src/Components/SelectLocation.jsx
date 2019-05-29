import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, notification } from 'antd';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import memoize from 'lodash/memoize';
import isEqual from 'lodash/isEqual';

import { getLocations } from '../apis/suggestion-apis';

const { Option } = Select;

class SelectLocation extends Component {
	static propTypes = {
		onChange: PropTypes.func,
		value: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.arrayOf(PropTypes.shape({}))]),
		applyPositions: PropTypes.func,
	};

	static defaultProps = {
		onChange: () => {},
		value: null,
		applyPositions: () => {},
	};

	pickIds = memoize((value) => {
		if (isArray(value)) {
			return value ? value.map(v => v.id) : [];
		}
		return value ? value.id : undefined;
	});

	constructor() {
		super();
		this.state = {
			loading: false,
			options: null,
			isMarkerSet: false,
		};
		this.cache = [];
	}

	componentDidMount() {
		this.seedOptions();
	}

	componentDidUpdate(prevProps) {
		const { value } = this.props;
		if (!isEqual(prevProps.value, value)) {
			this.seedOptions();
		}
	}

	onSearch = (value) => {
		this.getLocations(value);
	};

	onChange = (val) => {
		console.log("I will change")
		console.log({val});
		const { onChange, applyPositions } = this.props;
		const { options } = this.state;
		let newVal;
		if (isArray(val)) {
			newVal = val.map((locationId) => {
				let optionObj = this.cache.find(option => locationId === option.id);
				if (!optionObj) {
					optionObj = options.find(option => locationId === option.id);
					this.cache.push(optionObj);
				}
				return optionObj;
			});
		} else {
			newVal = options.find(option => val === option.id);
			console.log({newVal});
			applyPositions((newVal || {}).name, (newVal || {}).lat, (newVal || {}).long)
		}	
		onChange(newVal);
	};

	getLocations(value) {
		this.setState({ loading: true, options: null });
		const params = {
			q: value,
		};
		getLocations(params)
			.then((options) => {
				console.log({options});
				this.setState({ loading: false, options: ((options || {}).data || {}).suggestions || [] });
			})
			.catch((error) => {
				this.setState({ loading: false });
				notification.error({
					message: 'Problem fetching options',
				});
			});
	}

	seedOptions = () => {
		const { value, applyPositions } = this.props;
		let { options } = this.state;
		if (!options) {
			options = [];
		}
		if (value) {
			if (isArray(value)) {
				value.forEach((v) => {
					if (
						options.findIndex(o => (o || {}).id === (v || {}).id) === -1
					) {
						options.push(v);
						this.cache.push(v);
					}
				});
				this.setState({ options });
			} else {
				if (
					options.findIndex(o => (o || {}).id === (value || {}).id)
					=== -1
				) {
					options.push(value);
				}
				this.setState({ options });
			}
			applyPositions('Mumbai', 19, 72);
		}
	};

	renderOptions() {
		const { options } = this.state;
		return options
			? options.map(option => (
				<Option key={(option || {}).id} value={(option || {}).id}>
					{option.name}
				</Option>
			))
			: null;
	}

	render() {
		const { loading } = this.state;
		const { multiple, value, applyPositions, ...rest } = this.props;
		const mode = multiple ? 'multiple' : 'default';
		const val = this.pickIds(value);

		return (
				<Select
					{...rest}
					showSearch
					onSearch={debounce(this.onSearch, 300)}
					filterOption={false}
					mode={mode}
					allowClear
					onChange={this.onChange}
					defaultActiveFirstOption={false}
					value={val}
					placeholder="Search location ..."
					notFoundContent={loading ? 'loading ...' : 'No options found'}
				>
					{this.renderOptions()}
				</Select>
		);
	}
}

SelectLocation.propTypes = {
	onChange: PropTypes.func,
	multiple: PropTypes.bool,
	value: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.arrayOf(PropTypes.shape({}))]),
};

SelectLocation.defaultProps = {
	multiple: false,
	onChange: () => {},
	value: null,
};

export default SelectLocation;