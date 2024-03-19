
const jwt = require("jsonwebtoken");

// Phần cấu hình RBAC (ví dụ)
const roles = {
  admin: ['Staff Manager'],
  staff: ['read', 'update'],
};



// middleware/authentication.js
function access_permissions(req, res, next) {
  // Middleware kiểm tra trạng thái đăng nhập của người dùng
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader) {
    next(createError(401));
  }
  const token = authHeader;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err){
      next(createError(401));
    }
    else{
      req.user = decoded;
      req.session.access = "feature of account";
      next();
    }

  });
}