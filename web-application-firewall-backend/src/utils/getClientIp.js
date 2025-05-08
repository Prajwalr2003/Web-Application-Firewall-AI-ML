function getClientIp(req) {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  if (ip === '::1') {
    ip = '127.0.0.1';
  }

  if (ip.startsWith('::ffff:')) {
    ip = ip.split(':').pop();
  }

  return ip;
}

module.exports = getClientIp;