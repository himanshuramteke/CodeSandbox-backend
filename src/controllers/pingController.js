export async function pingCheck(req, res) {
    return res.json(200).json({ message: 'pong'});
}