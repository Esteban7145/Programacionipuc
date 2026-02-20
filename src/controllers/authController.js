const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const emailValid = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordValid = await bcrypt.compare(password, await bcrypt.hash(adminPassword, 10));

  if (!emailValid || !passwordValid) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { email: adminEmail, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.json({ token, admin: { email: adminEmail } });
};

module.exports = { loginAdmin };
