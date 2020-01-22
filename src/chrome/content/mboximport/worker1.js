// const { OS } =  importScripts("resource://gre/modules/osfile.jsm");
// const { OS } = require("resource://gre/modules/osfile.jsm");
importScripts("resource://gre/modules/osfile.jsm");
importScripts("resource://gre/modules/Services.jsm");

// console.debug('W ');

function worker1(dirPath) {
	console.debug('started worker  ' + dirPath);
}

onmessage = function (event) {
	let dirPath = event.data;
	let msgFolder = event.data;
	// if (OS !== undefined) {
		// console.debug(OS);
	// console.debug('started worker:  walkD '+dirPath);
	let startTime = new Date();
	console.debug('StartTime: ' + startTime.toISOString());

	var { Services } = self.ChromeUtils.import('resource://gre/modules/Services.jsm');
	var { Services } = self.ChromeUtils.import('resource://gre/modules/Services.jsm');
	// let msgFolder = GetSelectedMsgFolders()[0];

	console.debug('FolderName ' +msgFolder.name);
	// let d = dw(dirPath);

	let endTime = new Date();
	console.debug('ElapsedTime: ' + (endTime - startTime) / 1000);

	// console.debug('Results '+d.length);
	// d.map(f => console.debug(f));
	// postMessage(result.value);
}


// this works - ~0.7s for 660 folders
async function dirWalk(dirPath) {
	var iterator = new OS.File.DirectoryIterator(dirPath);
	var subdirs = [];

	// Iterate through the directory
	let p = iterator.forEach(
		function onEntry(entry) {
			if (entry.isDir) {
				// console.debug(entry.name);
				console.debug(entry.path);
				subdirs.push(entry);
			}
		}
	);

	return p.then(
		async function onSuccess() {
			iterator.close();
			// console.debug('dirs: ' + subdirs.map(d => d.name + ' '));

			for (const dir of subdirs) {
				// console.debug('subWalk '+ dir.name);
				let dirs = await dirWalk(entry.path);
				subdirs = subdirs.concat(dirs);
				// console.debug('accumulated dirs: ' + subdirs.map(d => d.name + ' '));
			}

			return subdirs;
		},
		function onFailure(reason) {
			iterator.close();
			throw reason;
		}
	);

}

function dw(d) {
	var subdirs = [];
	var iterator = new OS.File.DirectoryIterator(d);


	// console.debug('Walk  '+d);
	try {

		// for (let entry in iterator) {
		iterator.forEach(entry => {
			// console.debug(entry);
			if (entry.isDir) {
				subdirs.push(entry.path);
				// console.debug(entry.name);
				// entry is a directory
				let dirs = dw(entry.path);
				subdirs = subdirs.concat(dirs);
			}
		});
		// return [entry for (entry in iterator) if (entry.isDir) ];

	} finally {
		iterator.close();
	}
	return subdirs;

}
worker1('test');