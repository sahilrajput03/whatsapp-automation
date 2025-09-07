// @ts-nocheck
exports.preventPunyCodeWarning = () => {
    const originalWrite = process.stderr.write;
    process.stderr.write = function (chunk, encoding, callback) {
        if (chunk.toString().includes('The `punycode` module is deprecated')) {
            return false; // Prevents writing the warning
        }
        return originalWrite.apply(process.stderr, arguments);
    };
};
