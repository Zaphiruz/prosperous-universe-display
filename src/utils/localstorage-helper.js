export default class LocalStorageHelper {
	static saveRecord(key, data) {
		let type = typeof(data);
		if (type === 'object') {
			try {
				data = JSON.stringify(data, null, '');
			} catch {}
		}

		return window.localStorage.setItem(key, JSON.stringify({
			type,
			data
		}, null, ''));
	}

	static loadRecord(key) {
		let meta = window.localStorage.getItem(key);
		if (meta) {
			meta = JSON.parse(meta);

			if (meta.type === 'object') {
				meta.data = JSON.parse(meta.data);
			}
		}

		return meta?.data;
	}

	static clearRecord(key) {
		return window.localStorage.removeItem(key);
	}

	static clearAllRecords() {
		return window.localStorage.clear();
	}
}