import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

export default function withValidate(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      validate: PropTypes.func.isRequired,
      onChange: PropTypes.func,
      onFail: PropTypes.func,
      errorMsg: PropTypes.string,
    };

    static defaultProps = {
      onChange: null,
      onFail: null,
      errorMsg: '格式錯誤',
    };

    state = {
      errorMessage: '',
      value: '',
    };

    getValue = (event) => {
      const eventType = typeof event;

      switch (eventType) {
        case 'object': return event.target.value;
        // slateEditor: the default value is <p></p> when user clears all the content
        case 'string': return event === '<p></p>' ? '' : event;
        default: return event;
      }
    }

    doValidate = debounce((event) => {
      const value = this.getValue(event);
      const result = this.props.validate(value);
      this.setState({ value });
      if (result.error === null) {
        this.setState({ errorMessage: '' });
        if (this.props.onChange) {
          this.props.onChange(event);
        }
      } else {
        this.setState({ errorMessage: this.props.errorMsg });
        if (this.props.onFail) {
          this.props.onFail(event, this.props.errorMsg ? this.props.errorMsg : 'error');
        }
      }
    }, 300);

    render() {
      return (
        <WrappedComponent
          value={this.state.value}
          {...this.props}
          onChange={this.doValidate}
          errorMessage={this.state.errorMessage}
        />
      );
    }
  };
}
