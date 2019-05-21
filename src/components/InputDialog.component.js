import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from './Dialog';
import Button from './Button';
import { ValidateInput } from './Input';

class InputDialog extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired, // currently open or not
    validate: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isValid: props.value ? props.validate(props.value) : false,
    };
  }

  componentDidMount() {
    if (this.input) { this.input.focus(); }
  }

  onChange = (event) => {
    this.setState({
      isValid: true,
    });
    this.props.onChange(event);
  }

  onFail = () => {
    this.setState({
      isValid: false,
    });
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && this.state.isValid) {
      this.props.onSubmit();
    }
  }

  render() {
    const { title, text, value, isOpen, validator, onClose, onSubmit } = this.props;
    return (
      <Dialog
        open={isOpen}
        width="500px"
        title={title}
        onClose={onClose}
      >
        <div style={{
          paddingLeft: '40px',
          paddingRight: '40px',
          paddingBottom: '20px',
        }}>
          <p style={{ marginBottom: '15px' }}>{text}</p>
          <div className="input-wrapper">

            <ValidateInput
              type="text"
              value={value}
              onChange={this.onChange}
              validator={validator}
              onFail={this.onFail}
              errorMsg="請填入正確的格式"
              inputRef={(c) => { this.input = c; }}
              onKeyPress={this.handleKeyPress}
            />
          </div>
          <Button
            disabled={!this.state.isValid}
            style={{ marginTop: '15px' }}
            onClick={onSubmit}
            size="md"
            block
          >
            送出
          </Button>
        </div>
      </Dialog>
    );
  }
}

export default InputDialog;
