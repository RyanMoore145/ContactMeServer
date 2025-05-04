
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
	host: "smtp.office365.com",
	port: 587,
	secureConnection: false,
	auth: {
		user: process.env.SYSTEM_EMAIL,
		pass: process.env.SYSTEM_EMAIL_PASSWORD
	},
	tls: {
		ciphers: "SSLv3"
	}
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});		


function validateEmail(email) {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
}

function sendEmail(senderEmail, emailHeader, emailBody) {
	let fullHeader = `Message to Ryan Moore: ${emailHeader}`;
	let fullBody = `
		<h4>You have sent the following message to Ryan Moore:</h4>
		<p>${emailBody}</p>
		<h4>I will get back to you via this email thread or your prefered contact method as soon as I can.</h4>
		<p>Cheers, Ryan Moore</p>
		<p>(This message was sent automatically)</p>`;
	let mailOptions = {
		from: `Ryan Moore <${process.env.SYSTEM_EMAIL}>`,
		to: `${senderEmail}, ${process.env.PERSONAL_EMAIL}`,
		subject: fullHeader,
		html: fullBody
	};
	
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		}
		else {
			console.log(`Email sent: ${info.response}`);
		}
	});
}

app.post("/", (req, res) => {
	console.log(req.body);
	if (!req.body) {
		res.status(400).send({error: "Body empty"});
		return;
	}
	const {senderEmail, emailHeader, emailBody} = req.body;
	if (
		!senderEmail ||
		!emailHeader ||
		!emailBody
	) {
		res.status(400).send({error: "Not all fields included"});
		return;
	}
	else if (!validateEmail(req.body.senderEmail)) {
		res.status(400).send({error: "Invalid email format"});
		return;
	}
	else {
		sendEmail(senderEmail, emailHeader, emailBody);
		res.status(200).end();
		return;
	}
});