const nodemailer = require("nodemailer");

const sendMail = (to, subject, html) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "contacthypertube@gmail.com",
      pass: "jepensedoncjesuis",
    },
  });
  var mailOptions = {
    from: "contacthypertube@gmail.com",
    to,
    subject,
    html,
  };
  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent to " + to);
    }
  });
};

const sendSignUpMail = (to, username, validationToken) => {
  const mail = {
    from: "contacthypertube@gmail.com",
    to,
    subject: `Welcome to Hypertube !`,
    html: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
              <td style="text-align:center">
                <img src="cid:logoHypertube" width="245" />
                <tr> 
                  <td style="font-family:Helvetica, Arial, sans;text-align:center;font-weight:bold;font-size:32px;color:rgb(34, 31, 31);line-height:36px;padding:40px 90px 10px 90px;">
                    Welcome ${username} !
                  </td> 
                </tr>
                <tr> 
                  <td style="text-align:center;padding:22px 90px 0 90px;font-family:Helvetica Neue, Helvetica, Roboto, Segoe UI, sans-serif;font-size:16px;line-height:24px;-webkit-font-smoothing:antialiased;">
                    Watch as many TV shows & movies as you want on :
                  </td> 
                </tr>
                <tr>
                  <td align="center" style="padding:20px 44px 0 44px;">
                    <a href="http://localhost:3000/activateUser?username=${username}&token=${validationToken}" style="text-decoration:none;color:inherit;">
                      <table class="button red" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tbody>
                          <tr>
                            <td align="center" style="font-size:14px;font-weight:bold;background-color:#1DE9B6;text-align:center;padding:3px 22px;border-radius:50px;max-width:260px;">
                            <p>
                              <a href="http://localhost:3000/activateUser?username=${username}&token=${validationToken}" style="color:#004d40;font-family: Helvetica, Arial, sans;font-size:14px;font-weight:bold;text-align:center;text-decoration:none;color:inherit;;font-size:14px;font-weight:bold;text-align:center;text-decoration:none;font-family:Helvetica, Arial, sans;">
                                Hypertube.com
                              </a>
                            </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </a>
                  </td>
                </tr>
              </td>
            </tr>
        </tbody>
      <table>`,
  };

  sendMail(mail.to, mail.subject, mail.html);
};

const sendResetPasswordMail = (to, forgotToken) => {
  const mail = {
    from: "contacthypertube@gmail.com",
    to,
    subject: `Reset your password !`,
    html: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
              <td style="text-align:center">
                <img src="cid:logoHypertube" width="245" />
                <tr> 
                  <td style="font-family:Helvetica, Arial, sans;text-align:center;font-weight:bold;font-size:32px;color:rgb(34, 31, 31);line-height:36px;padding:40px 90px 10px 90px;">
                    Forgot your password ?
                  </td> 
                </tr>
          
                <tr>
                  <td align="center" style="padding:20px 44px 0 44px;">
                    <a href="http://localhost:3000/resetPassword?email=${to}&token=${forgotToken}" style="text-decoration:none;color:inherit;">
                      <table class="button red" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tbody>
                          <tr>
                            <td align="center" style="color:rgb(255, 255, 255);font-size:14px;font-weight:bold;background-color:rgb(229, 9, 20);text-align:center;padding:3px 22px;border-radius:4px;max-width:250px;">
                            <p>
                              <a href="http://localhost:3000/resetPassword?email=${to}&token=${forgotToken}" style="color:#ffffff;font-family: Helvetica, Arial, sans;font-size:14px;font-weight:bold;text-align:center;text-decoration:none;color:inherit;color:rgb(255, 255, 255);font-size:14px;font-weight:bold;text-align:center;text-decoration:none;font-family:Helvetica, Arial, sans;">
                                Reset my password
                              </a>
                            </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </a>
                  </td>
                </tr>
              </td>
            </tr>
        </tbody>
      <table>`,
  };

  sendMail(mail.to, mail.subject, mail.html);
};

module.exports = { sendSignUpMail, sendResetPasswordMail };
