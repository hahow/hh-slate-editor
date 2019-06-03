
export const editorJoiSchema = {
  text: (input) => {
    if (input && typeof input === 'string' && input.length >= 1) {
      return true;
    }
    return false;
  },
  url: (input) => {
    if (input && typeof input === 'string') {
      if (input.startsWith('http://') || input.startsWith('https://')) {
        return true;
      }
    }
    return false;
  },
  giphyUrl: (input) => {
    if (input && typeof input === 'string') {
      const regex = /\/\/giphy\.com\/gifs\/(\w*?-)*?(\w*?)$/;
      if (regex.test(input)) {
        return true;
      }
    }
    return false;
  },
  youtubeUrl: (input) => {
    if (input && typeof input === 'string') {
      const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      if (regex.test(input)) {
        return true;
      }
    }
    return false;
  },
  vimeoUrl: (input) => {
    if (input && typeof input === 'string') {
      const regex = /\/\/(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
      if (regex.test(input)) {
        return true;
      }
    }
    return false;
  },
  mixCloudUrl: (input) => {
    if (input && typeof input === 'string') {
      const regex = /(http:|https:)?\/\/www\.mixcloud\.com\/.*\/.*\//;
      if (regex.test(input)) {
        return true;
      }
    }
    return false;
  }
};
