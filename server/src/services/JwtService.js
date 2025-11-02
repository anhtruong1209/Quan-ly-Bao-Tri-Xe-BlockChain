const jwt = require("jsonwebtoken");

// Hardcode JWT secrets
const ACCESS_TOKEN_SECRET = "your-access-token-secret-key-here-change-in-production";
const REFRESH_TOKEN_SECRET = "your-refresh-token-secret-key-here-change-in-production";

const genneralAccessToken = async (payload) => {
  // console.log("payload", payload);
  const access_token = jwt.sign(
    {
      ...payload,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "30d" } // Tăng lên 30 ngày thay vì 30 giây
  );

  return access_token;
};

const genneralRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(
    {
      ...payload,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "365d" }
  );

  return refresh_token;
};

const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) {
          resolve({
            status: "ERR",
            message: "The authemtication",
          });
        }
        const access_token = await genneralAccessToken({
          id: user?.id,
          isAdmin: user?.isAdmin,
        });
        resolve({
          status: "OK",
          message: "SUCESS",
          access_token,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenJwtService,
};
