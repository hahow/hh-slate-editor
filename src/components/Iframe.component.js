import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledIframe = styled.div`
  .iframe-wrapper {
    position: relative;
    outline: ${props => (props.isSelected ? '3px solid blue' : 'none')};
    &:hover {
      outline: 3px solid blue;
      opacity: 0.8;
    }
  }

  .iframe-mask {
    display: ${props => (props.isSelected ? 'none' : 'block')};
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
  }

  iframe {
    display: block;
  }
`;

class Iframe extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    attributes: PropTypes.object.isRequired,
  }

  renderIframe() {
    const type = this.props.type;
    const src = this.props.node.data.get('src');
    if (type === 'video') {
      return (
        <div className="video-container">
          <iframe
            title="video"
            type="text/html"
            src={src}
            frameBorder="0"
          />
        </div>
      );
    } else if (type === 'audio') {
      return (
        <iframe
          title="video"
          type="text/html"
          src={src}
          frameBorder="0"
          height="120px"
        />
      );
    }
    return null;
  }

  render() {
    return (
      <StyledIframe {...this.props.attributes} isSelected={this.props.isSelected}>
        <div className="iframe-wrapper">
          <div className="iframe-mask" />
          {this.renderIframe()}
        </div>
      </StyledIframe>
    );
  }
}

export default Iframe;

