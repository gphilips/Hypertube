const nodemailer = require("nodemailer");
const path = require('path');

const sendMail = mail => {
  nodemailer.createTestAccount((err, account) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass // generated ethereal password
      }
    });

    transporter.sendMail(mail, (err, info) => {
      if (err) throw err;
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  });
};

exports.sendSignUpMail = (to, username) => {
  const mail = {
    from: '"Hypertube 🎬" <no-reply@hypertube.com>',
    to,
    subject: `Welcome to Hypertube !`,
    html: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
              <td style="text-align:center">
                <img src="cid:logoHypertube"/>
                <h1>Welcome ${username} !</h1>
                <p>Watch as many TV shows & movies as you want on :</p>
                <tr>
                  <td align="center" style="padding:20px 44px 0 44px;">
                    <a href="${process.env.SITEURL}" style="text-decoration:none;color:inherit;">
                      <table class="button red" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tbody>
                          <tr>
                            <td align="center" style="color:rgb(255, 255, 255);font-size:14px;font-weight:bold;background-color:rgb(229, 9, 20);text-align:center;padding:12px 22px;border-radius:4px;max-width:250px;">
                              <a href="${process.env.SITEURL}" style="color:#ffffff;font-family: Helvetica, Arial, sans;font-size:14px;font-weight:bold;text-align:center;text-decoration:none;color:inherit;color:rgb(255, 255, 255);font-size:14px;font-weight:bold;text-align:center;text-decoration:none;font-family:Helvetica, Arial, sans;">
                                Hypertube.com
                              </a>
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
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../public/images/logo.png'),
      cid: 'logoHypertube',
    }]
  };

  sendMail(mail);
};
