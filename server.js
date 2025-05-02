

const express = require("express");
const cors = require("cors");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	requireTLS: true,
	from: process.env.SYSTEM_EMAIL,
	auth: {
		user: process.env.SYSTEM_EMAIL,
		pass: process.env.SYSTEM_EMAIL_PASSWORD
	}
});

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

function validateEmail(email) {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
}

async function sendEmail(senderEmail, emailHeader, emailBody) {
	let mailOptions = {
		from: `Ryan Moore <${process.env.SYSTEM_EMAIL}>`,
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
	const {senderEmail, emailHeader, emailBody} = req.body;
	if (
		!senderEmail ||
		!emailHeader ||
		!emailBody
	) {
		res.status(400).send({error: "Not all fields included"});
	}
	else if (!validateEmail(req.body.senderEmail)) {
		res.status(400).send({error: "Invalid email format"});
	}
	else {
		sendEmail(senderEmail, emailHeader, emailBody);
		res.status(200).end();
	}
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});	