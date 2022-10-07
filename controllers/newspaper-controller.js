
const getContent = async(req, res, next) => {
    res.status(200).json({data:"icerdeyiz"});
}

module.exports = {
    getContent
}