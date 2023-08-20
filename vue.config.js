module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "./colors.scss";
        `,
      },
    },
  },
};
