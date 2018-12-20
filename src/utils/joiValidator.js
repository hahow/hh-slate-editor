import Joi from 'joi-browser';

export const editorJoiSchema = {
  text: Joi.string().min(1),
  url: Joi.string().uri({ scheme: ['http', 'https'] }),
  giphyUrl: Joi.string().regex(/\/\/giphy\.com\/gifs\/(\w*?-)*?(\w*?)$/),
  youtubeUrl: Joi.string().regex(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/),
  vimeoUrl: Joi.string().regex(/\/\/(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/),
  mixCloudUrl: Joi.string().regex(/(http:|https:)?\/\/www\.mixcloud\.com\/.*\/.*\//),
};