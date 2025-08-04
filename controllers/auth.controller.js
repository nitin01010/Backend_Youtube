const jwt = require('jsonwebtoken');
const User = require('../module/users.modules');

async function handleAuth(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(200).json({
        success: false,
        auth: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(200).json({
        success: false,
        auth: false,
        message: 'Invalid token'
      });
    }

    const findUser = await User.findById(decoded.id);
    const {username,avatar,_id,email,channels} = findUser;

    req.user = decoded;

    return res.status(200).json({
      success: true,
      auth: true,
      userId:{
        username,avatar,_id,email,channels
      }
    });

  } catch (error) {
    return res.status(200).json({
      success: false,
      auth: false,
      message: 'Server error'
    });
  }
}

module.exports = handleAuth;