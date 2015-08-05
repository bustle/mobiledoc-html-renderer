const ImageCard = {
  name: 'image',
  html: {
    setup(buffer, options, env, payload) {
      if (payload.src) {
        buffer.push(`<img src="${payload.src}">`);
      }
    }
  }
};

export default ImageCard;
