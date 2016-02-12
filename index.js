"use strict";

const defaultScriptOptions = {
	condition: "",
	context: "client",
	run_at: "start"
};

class RegisteredScript {

	constructor(path, options) {
		this.path = this.parsePath(path);
		this.options = this.parseOptions(options);
	}

	parsePath(path) {
		if(path.startsWith("//")
		|| path.startsWith("http://")
		|| path.startsWith("https://")) {
			this.isExternal = true;
		} else {
			this.isExternal = false;
		}
		return path;
	}

	parseOptions(options) {
		var parsedOptions = {};

		for(let name in defaultScriptOptions) {
			let option = options[name] || defaultScriptOptions[name];

			parsedOptions[name] = this.parseOption(name, option);
		}

		return parsedOptions;
	}

	parseOption(name, value) {
		switch(name) {
			case 'context':
				if(value !== "server-only"
				&& value !== "server"
				&& value !== "client") {
					console.warn(`[ssdom-ext-base] Registered script context=${value} is invalid. context may only be 'server-only', 'server', or 'client'. Defaulting to 'client'.`);
					value = 'client';
				}
				break;
			case 'run_at':
				if(value !== "start"
				&& value !== "end") {
					console.warn(`[ssdom-ext-base] Registered script run_at=${value} is invalid. run_at may only be 'start' or 'end'. Defauling to 'start'.`);
					value = 'start';
				}
				break;
			default:
				throw Error(`Registered Script option '${name}' is invalid.`);
		}

		return value;
	}
};

if(typeof module.parent.exports._ssdomRegisteredScripts === "undefined") {
	module.parent.exports._ssdomRegisteredScripts = [];
}
delete require.cache[__filename];

exports.registerScript = function(path, options) {
	if(Array.isArray(path)) {
		path.forEach(function(path) {
			module.parent.exports._ssdomRegisteredScripts.push(new RegisteredScript(path, options));
		});
	} else {
		module.parent.exports._ssdomRegisteredScripts.push(new RegisteredScript(path, options));
	}
};
