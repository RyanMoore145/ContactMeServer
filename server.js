
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	requireTLS: true,
	auth: {
		user: process.env.SYSTEM_EMAIL,
		pass: process.env.SYSTEM_EMAIL_PASSWORD
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
	let mailOptions = {
		from: `${process.env.SYSTEM_EMAIL}`,
		to: senderEmail,
		subject: emailHeader,
		text: emailBody
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