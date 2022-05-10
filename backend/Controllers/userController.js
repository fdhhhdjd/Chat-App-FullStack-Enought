const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
const userCtrl = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, picture } = req.body;
      const emailCheck = await User.findOne({ email });
      if (emailCheck)
        return res.json({ msg: "Email không tồn tại !", status: false });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        name,
        password: hashedPassword,
        picture,
      });
      delete user.password;
      return res.json({ status: true, msg: "Đăng ký thành công!!!", user });
    } catch (ex) {
      next(ex);
    }
  },
  Login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.json({
          msg: "Email không tồn tại ! ",
          status: false,
        });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.json({
          msg: "Mật khẩu không đúng !",
          status: false,
          user,
        });
      delete user.password;
      return res.json({ status: true, msg: "Đăng nhập thành công !", user });
    } catch (ex) {
      next(ex);
    }
  },
};
module.exports = userCtrl;
