async function getTestRoute(req, res) {
    try {
        res.status(200).send('<h1>Test Route</h1>')
    } catch (error) {
        res.status(200).send('<h1>Somethink worng</h1>')
    }
}

module.exports = {
    getTestRoute
}