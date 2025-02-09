const MB = 5; // 5 MB 
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
    const files = req.files

    const filesOverLimit = []
    // Tamanho limite do arquivo
    Object.keys(files).forEach(key => {
        if (files[key].size > FILE_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name)
        }
    })

    if (filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? 'are' : 'is';

        const sentence = `Upload falhou. ${filesOverLimit.toString()} ${properVerb} limite excedido de ${MB} MB.`.replaceAll(",", ", ");

        const message = filesOverLimit.length < 3
            ? sentence.replace(",", " and")
            : sentence.replace(/,(?=[^,]*$)/, " and");

        return res.status(413).json({ status: "error", message });

    }

    next()
}

module.exports = fileSizeLimiter