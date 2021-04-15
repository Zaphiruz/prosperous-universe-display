import { request } from 'graphql-request';
import { isEmpty } from 'lodash';

export function query(url, method, headers, body) {
	let headerString = _makeHeaderString(headers);
	let bodyString = _makeBodyString(body);
	let queryString = `query { ${method}${headerString} { \n${bodyString}\n } }`

	console.log('fetch ', url);
	console.log("headerString", headerString);
	console.log("bodyString", bodyString);
	return request(url, queryString).then(data => data[method]);
}

export function paginate(url, method, headers, body) {
	const paginationBody = {
		count: true,
		items: body,
		pageInfo: {
			currentPage: true,
			perPage: true,
			pageCount: true,
			itemCount: true,
			hasNextPage: true,
			hasPreviousPage: true,
		}
    }

	return query(url, method, headers, paginationBody);
}

/**
 * {
 * 	filter: { name: "7" },
 * 	sort: "_CODE_ASC",
 * }
 */
function _makeHeaderString(header) {
	let headerArray = [];
	if (header) {
		let queries = Object
			.entries(header)
			.map(([key, value]) => {
				switch (true) {
					case Array.isArray(value):
						return `${key}: [${value.map(v => `"${v}"`).join(',')}],`;

					case typeof (value) === 'object':
						return `${key}: { ${Object.entries(value).map(thingToString).join('')} },`

					case typeof (value) === 'number':
						return `${key}: ${value},`

					case typeof (value) === 'undefined':
						return;

					default:
						return `${key}: "${value}",`
				}
			});

		headerArray = ['(', ...queries, ')']
	}
	//console.log('headerArray', headerArray);
}

function _makeBodyString(body) {
	function stringify(obj) {
		let string = '';
		for (let [key, value] of Object.entries(obj)) {
			if (typeof value === 'object') {
				let valueString = stringify(value);
				string += `${key} { \n${valueString}\n },\n`
			} else {
				string += `${key},\n`;
			}
		}

		return string;
	}

	return typeof(body) === 'object' ? stringify(body) : body;
}
