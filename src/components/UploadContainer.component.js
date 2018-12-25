import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';

export const FileInput = styled.input`
  display: none !important;
`;

class UploadContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onDelete: PropTypes.func,
    onUpload: PropTypes.func,
    onCancel: PropTypes.func,
    fulfilledCallback: PropTypes.func,
    onValidateFailed: PropTypes.func,
    validator: PropTypes.func,
    accept: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    onDelete: () => {},
    onUpload: undefined,
    fulfilledCallback: undefined,
    onCancel: undefined,
    onValidateFailed: null,
    validator: undefined,
    accept: '',
    className: '',
  };

  onUpload = () => {
    const { onUpload, fulfilledCallback, onValidateFailed } = this.props;
    const file = this.file.files[0];

    if (onUpload && file) {
      if (this.props.validator) {
        const isValid = this.props.validator(file);
        if (isValid.result) {
          onUpload(file, fulfilledCallback);
        } else {
          return onValidateFailed ? onValidateFailed(isValid.message) : null;
        }
      } else {
        onUpload(file, fulfilledCallback);
      }
    }
    // clean input
    this.file.value = '';
    return null;
  };

  onSelectFile = isUpload => (e) => {
    e.stopPropagation();

    if (isUpload) {
      this.file.click();
    } else {
      this.props.onDelete();
    }
  };

  render() {
    const { children, className, ...restProps } = this.props;
    return (
      <button className={className} {...restProps}>
        <FileInput
          type="file"
          accept={this.props.accept}
          onChange={this.onUpload}
          innerRef={(c) => {
            this.file = c;
          }}
        />
        <div className="click-container" onClick={this.onSelectFile(true)}>
          {
            React.cloneElement(children, {
              onClick: this.onSelectFile,
            })
          }
        </div>
      </button>
    );
  }
}

export default UploadContainer;
