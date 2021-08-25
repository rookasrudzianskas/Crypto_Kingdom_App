module.exports = {
    resolver: {
        blacklistRE: /#current-cloud-backend\/.*/
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),
    },
};
