const nodemailer = require('nodemailer');



function getPlainText(bdy) {
	plain_text = bdy;
	plain_text = plain_text.replace(/<style([\s\S]*?)<\/style>/gi, '');
	plain_text = plain_text.replace(/<script([\s\S]*?)<\/script>/gi, '');
	plain_text = plain_text.replace(/<\/div>/ig, '\n');
	plain_text = plain_text.replace(/<\/li>/ig, '\n');
	plain_text = plain_text.replace(/<li>/ig, '  *  ');
	plain_text = plain_text.replace(/<\/ul>/ig, '\n');
	plain_text = plain_text.replace(/<\/p>/ig, '\n');
	plain_text = plain_text.replace(/<br\s*[\/]?>/gi, "\n");
	plain_text = plain_text.replace(/<[^>]+>/ig, '');
	return plain_text;
}


if(project_settings.store_plain_text_info == false) {
	var div = document.getElementById("login");
	div.innerHTML = `<div>
          <h3>Login information</h3>
          <label for="usrnm" class="ui-hidden-accessible">Username:</label>
          <input type="text" name="user" id="usrnm" placeholder="email">
          <label for="pswd" class="ui-hidden-accessible">Password:</label>
          <input type="password" name="passw" id="pswd" placeholder="password">
        </div>`;
		//	TODO: Change this
}


function sendMail() {
	var address = document.getElementById("address").value;
	
	var body;
	var plain_text;
	//	standard text area or rtf
	if(project_settings.plain_text_editor) {
		body = document.getElementById("text_input").value;
		plain_text = getInnerText(document.getElementById("text_input"));
	} else {
		var nicE = new nicEditors.findEditor('text_input');
		body = nicE.getContent();
		plain_text = getPlainText(body);
	}
	
	
	console.log(document.getElementById("text_input").value);
	console.log(address + " body :\n" + body);
	
	var message = {
		
	};
	var transporter;
	if(project_settings.store_plain_text_info == false) {
		var div = document.getElementById("login");
		transporter = nodemailer.createTransport({
			host: project_settings.host,
			port: project_settings.port,
			secure: project_settings.secure,
			auth: {
				user: document.getElementById("usrnm").value,
				pass: document.getElementById("pswd").value
			}
		});
	} else {
		transporter = nodemailer.createTransport({
			host: project_settings.host,
			port: project_settings.port,
			secure: project_settings.secure,
			auth: {
				user: project_settings.username,
				pass: project_settings.password
			}
		});
	}
	
	var mailOptions;
	
	if(project_settings.plain_text_editor) {
		mailOptions = {
			from: document.getElementById("from").value,
			to: address,
			subject: document.getElementById("subject").value,
			text: plain_text,
			html: body
		}
	} else {
		mailOptions = {
			from: document.getElementById("from").value,
			to: address,
			subject: document.getElementById("subject").value,
			text: plain_text,
			html: body
	}
	}
	
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			alert(error);
			return console.log(error);
		}
		return alert("message sent: "+ info.messageId);
		
	});
	
};