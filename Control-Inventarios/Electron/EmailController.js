var nodemailer = require("nodemailer");

//Creamos el objeto de transporte
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "control.inventario.ucr.Rgu@gmail.com",
    pass: "ciucrrgu2021",
  },
});
module.exports = class Email {
  recoveryMessage(correo, user, password) {
    var message =
      "Estimado " +
      user +
      "\nSe ha envíado este correo para la recuperación de la contraseña";
    var htmlMessage = "Su contraseña es:<strong>" + password + "</strong>";
    var mailOptions = {
      from: "control.inventario.ucr.Rgu@gmail.com",
      to: correo,
      subject: "Recuperación de Contraseña de Control de Inventario - " + user,
      text: message,
      html: message + "<br><br>" + htmlMessage,
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email enviado: " + info.response);
      }
    });
  }
};
