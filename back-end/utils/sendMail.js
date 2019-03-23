const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '/config/.env')})

const sendMail = mail => {
  const options = {
    auth: {
      api_key: process.env.SENDGRID_PASSWORD,
    }
  }
  const client = nodemailer.createTransport(sgTransport(options));
  client.sendMail(mail);
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
                    <a href="${process.env.SITEURL}" style="text-decoration:none;color:inherit;">
                      <table class="button red" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tbody>
                          <tr>
                            <td align="center" style="color:rgb(255, 255, 255);font-size:14px;font-weight:bold;background-color:rgb(229, 9, 20);text-align:center;padding:3px 22px;border-radius:4px;max-width:250px;">
                            <p>
                              <a href="${process.env.SITEURL}" style="color:#ffffff;font-family: Helvetica, Arial, sans;font-size:14px;font-weight:bold;text-align:center;text-decoration:none;color:inherit;color:rgb(255, 255, 255);font-size:14px;font-weight:bold;text-align:center;text-decoration:none;font-family:Helvetica, Arial, sans;">
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
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../public/images/logo.png'),
      cid: 'logoHypertube',
    }]
  };

  sendMail(mail);
};

exports.sendForgotMail = (to, username, token) => {
  const mail = {
    from: '"Hypertube 🎬" <no-reply@hypertube.com>',
    to,
    subject: `Reset your passwword`,
    html: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
              <td style="text-align:center">
                <img src="cid:logoHypertube" width="245" />
                <tr> 
                  <td style="font-family:Helvetica, Arial, sans;text-align:center;font-weight:bold;font-size:25px;color:rgb(34, 31, 31);line-height:36px;padding:40px 90px 10px 90px;">
                    Reset your password
                  </td> 
                </tr>
                <tr> 
                  <td style="text-align:center;padding:22px 90px 0 90px;font-family:Helvetica Neue, Helvetica, Roboto, Segoe UI, sans-serif;font-size:16px;line-height:24px;-webkit-font-smoothing:antialiased;">
                    Hi ${username},
                  </td> 
                </tr> 
                <tr> 
                  <td style="text-align:center;padding:22px 90px 0 90px;font-family:Helvetica Neue, Helvetica, Roboto, Segoe UI, sans-serif;font-size:16px;line-height:24px;-webkit-font-smoothing:antialiased;">
                    You just have to click on the button to reset your password.
                  </td> 
                </tr>
                <tr> 
                  <td style="text-align:center;padding:10x 90px 0 90px;font-family:Helvetica Neue, Helvetica, Roboto, Segoe UI, sans-serif;font-size:16px;line-height:24px;-webkit-font-smoothing:antialiased;">
                    Then fill the form to update it.
                  </td> 
                </tr> 
                <td align="center" style="padding:20px 44px 0 44px;">
                  <a href="${process.env.SITEURL}/reset/${username}/${token}" style="text-decoration:none;color:inherit;">
                    <table class="button red" cellpadding="0" cellspacing="0" border="0" align="center">
                      <tbody>
                        <tr>
                          <td align="center" style="color:rgb(255, 255, 255);font-size:14px;font-weight:bold;background-color:rgb(229, 9, 20);text-align:center;padding:3px 22px;border-radius:4px;max-width:250px;">
                          <p>
                            <a href="${process.env.SITEURL}/reset/${username}/${token}" style="color:#ffffff;font-family: Helvetica, Arial, sans;font-size:14px;font-weight:bold;text-align:center;text-decoration:none;color:inherit;color:rgb(255, 255, 255);font-size:14px;font-weight:bold;text-align:center;text-decoration:none;font-family:Helvetica, Arial, sans;">
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
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../public/images/logo.png'),
      cid: 'logoHypertube',
    }]
  };

  sendMail(mail);
};

exports.sendResetMail = (to, username) => {
  const mail = {
    from: '"Hypertube 🎬" <no-reply@hypertube.com>',
    to,
    subject: `Your password has been changed`,
    html: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
              <td style="text-align:center">
                <img src="cid:logoHypertube" width="245" />
                <tr> 
                  <td style="text-align:center;font-family:Helvetica, Arial, sans;font-weight:bold;font-size:32px;color:rgb(34, 31, 31);line-height:36px;padding:40px 90px 10px 90px;">
                    Password updated
                  </td> 
                </tr>
                <tr> 
                  <td style="text-align:center;padding:22px 90px 0 90px;font-family:Helvetica Neue, Helvetica, Roboto, Segoe UI, sans-serif;font-size:16px;line-height:24px;-webkit-font-smoothing:antialiased;">
                    Hi ${username},
                  </td> 
                </tr> 
                <tr> 
                  <td style="text-align:center;padding:22px 90px 0 90px;font-family:Helvetica Neue, Helvetica, Roboto, Segoe UI, sans-serif;font-size:16px;line-height:24px;-webkit-font-smoothing:antialiased;">
                    We've changed your password on your account, as you asked.
                  </td> 
                </tr>
                <tr> 
                  <td style="text-align:center;padding:10px 90px 0 90px;font-family:Helvetica Neue, Helvetica, Roboto, Segoe UI, sans-serif;font-size:16px;line-height:24px;-webkit-font-smoothing:antialiased;">
                    We are here to help you if you need it.
                  </td> 
                </tr> 
                <tr> 
                  <td style="text-align:center;padding:22px 90px 0 90px;font-family:Helvetica Neue, Helvetica, Roboto, Segoe UI, sans-serif;font-size:16px;line-height:24px;-webkit-font-smoothing:antialiased;">
                    - The Hypertube Team.
                  </td> 
                </tr> 

                <td align="center" style="padding:20px 44px 0 44px;">
                  <a href="${process.env.SITEURL}" style="text-decoration:none;color:inherit;">
                    <table class="button red" cellpadding="0" cellspacing="0" border="0" align="center">
                      <tbody>
                        <tr>
                          <td align="center" style="color:rgb(255, 255, 255);font-size:14px;font-weight:bold;background-color:rgb(229, 9, 20);text-align:center;padding:3px 22px;border-radius:4px;max-width:250px;">
                          <p>
                            <a href="${process.env.SITEURL}" style="color:#ffffff;font-family: Helvetica, Arial, sans;font-size:14px;font-weight:bold;text-align:center;text-decoration:none;color:inherit;color:rgb(255, 255, 255);font-size:14px;font-weight:bold;text-align:center;text-decoration:none;font-family:Helvetica, Arial, sans;">
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
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../public/images/logo.png'),
      cid: 'logoHypertube',
    }]
  };

  sendMail(mail);
};