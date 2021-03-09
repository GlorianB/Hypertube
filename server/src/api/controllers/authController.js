exports.getSession = (req, res) => {
  return res.status(200).json({ status: "success", message: "user authenticated", user: req.user });
};

exports.getLoginFailed = (request, response, next) => {
  return response.status(401).json({
    success: false,
    message: "user failed to authenticate",
  });
};

exports.getLogout = (request, response) => {
  if (request.isAuthenticated()) {
    request.logout();
    return response.status(200).json({ status: "success", message: "Logged out successfuly" });
  }
  return response.status(401).json({ status: "error", message: "User was not logged in" });
};
