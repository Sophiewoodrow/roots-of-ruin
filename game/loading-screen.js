"use strict";

(() => {
	const loadingScreen = document.getElementById("game-loading-screen");
	if (!loadingScreen) return;

	const revealGame = () => {
		// Wait for the browser to paint the ready game before fading the cover.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				loadingScreen.classList.add("is-ready");
				loadingScreen.setAttribute("aria-hidden", "true");
			});
		});
	};

	/*
	 * Construct assigns RuntimeInterface while its main module starts. Wrapping
	 * the public message handler lets us react to the runtime's real ready signal
	 * without changing Construct's generated engine code or using a fixed timer.
	 */
	Object.defineProperty(window, "RuntimeInterface", {
		configurable: true,
		get() {
			return undefined;
		},
		set(RuntimeInterface) {
			Object.defineProperty(window, "RuntimeInterface", {
				configurable: true,
				writable: true,
				value: RuntimeInterface,
			});

			const prototype = RuntimeInterface.prototype;
			const onRuntimeMessage = prototype._OnMessageFromRuntime;

			prototype._OnMessageFromRuntime = function (message) {
				const result = onRuntimeMessage.call(this, message);
				if (message && message.type === "runtime-ready") revealGame();
				return result;
			};
		},
	});
})();
