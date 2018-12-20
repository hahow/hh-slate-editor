import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Input as StyledInput, RelativeDiv, PrefixConnector, UrlPrefix } from './Input.style';
import ErrorMessage from '../ErrorMessage.component';

class Input extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    errorMessage: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.node,
    className: PropTypes.string,
    inputRef: PropTypes.func,
    prefix: PropTypes.string,
    shouldUpdateValue: PropTypes.bool,
  };

  static defaultProps = {
    onChange: null,
    errorMessage: '',
    value: '',
    children: null,
    className: '',
    inputRef: () => {},
    prefix: '',
    shouldUpdateValue: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
    this.onChange = this.onChange.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }
  // TODO 還需要檢視更新機制
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value && nextProps.value !== this.state.value) {
      this.updateValue(nextProps.value);
    }
  }

  onChange(event) {
    // The SyntheticEvent is pooled.
    // This means that the SyntheticEvent object will be reused
    // and all properties will be nullified after the event callback has been invoked.
    // This is for performance reasons. As such, you cannot access the event in an asynchronous way.
    // If you want to access the event properties in an asynchronous way,
    // you should call event.persist() on the event, which will remove the synthetic event from the
    // pool and allow references to the event to be retained by user code.
    // See more https://facebook.github.io/react/docs/events.html#event-pooling
    event.persist();

    if (this.props.shouldUpdateValue) {
      this.updateValue(event.target.value);
    }
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  updateValue(value) {
    this.setState({
      value,
    });
  }

  focus = () => {
    this.input.focus();
  }

  select = () => {
    this.input.select();
  }

  render() {
    const { children, className, ...otherProps } = this.props;
    return (
      <div className={className}>
        <RelativeDiv className="input-wrapper">
          {this.props.prefix !== '' ? (
            <PrefixConnector>
              <StyledInput
                {...otherProps}
                className="input-element"
                innerRef={(ele) => {
                  this.input = ele;
                  this.props.inputRef(ele);
                }}
                onChange={this.onChange}
                error={Boolean(this.props.errorMessage)}
                value={this.state.value}
              />
              <UrlPrefix>{this.props.prefix}</UrlPrefix>
            </PrefixConnector>
          ) : (
            <StyledInput
              {...otherProps}
              className="input-element"
              innerRef={(ele) => {
                this.input = ele;
                this.props.inputRef(ele);
              }}
              onChange={this.onChange}
              error={Boolean(this.props.errorMessage)}
              value={this.state.value}
            />
          )}
          {children}
        </RelativeDiv>
        {this.props.errorMessage ?
          <ErrorMessage>
            <FontAwesome name="exclamation-triangle" />
            {this.props.errorMessage}
          </ErrorMessage> : null
        }
      </div>
    );
  }
}

export default Input;
