

import * as express from 'express'
import * as bodyParser from "body-parser"
import * as request from 'request'

interface Request {
	data: string
}

interface Data {
	firstName: string;
	lastName: string;
	clientId: string
}

interface Response {
	statusCode: number;
	data: Data
}

class App {
	public express: express.Express
	constructor() {
		this.express = express();
		this.routes();
	}

	firstMatch(data) {
		return data.match(/([0|9])\1+/g)
	}

	secondMatch(data) {
		return data.split(new RegExp(['0', '9'].join('|'), 'g')).filter(Boolean)
	}

	//function to handle the version1
	v1(datain) {
		let firstmatch = this.firstMatch(datain);
		let secondmatch = this.secondMatch(datain);
		const dataout: Data = {
			firstName: secondmatch[0] + firstmatch[0],
			lastName: secondmatch[1] + firstmatch[1],
			clientId: firstmatch[2] + secondmatch[2]
		}
		return dataout
	}

	//function to handle version2
	v2(datain) {
		let firstmatch = this.firstMatch(datain);
		let secondmatch = this.secondMatch(datain);
		const dataout: Data = {
			firstName: secondmatch[0],
			lastName: secondmatch[1],
			clientId: firstmatch[2] + '-' + secondmatch[2]
		}
		return dataout
	}

	private routes(): void {
		const router1 = express.Router()
		router1.post('/api/:version(v1|v2)/parse', (req, res) => {
			let reqBody: Request = req.body as Request
			let ver = req.params.version
			const data = this[`${ver}`](reqBody.data)
			let response: Response = {
				statusCode: 200,
				data: data
			}
			res.json(response);
		})
		this.express.use(bodyParser.json())
		this.express.use('', router1)
	}

	public listen(port: number): void {
		this.express.listen(port, (err: any) => {
			if (err) {
				return console.log(err)
			}
			return console.log(`server is listening on port ${port}`)
		})
	}
}

let app = new App()
app.listen(8020)

