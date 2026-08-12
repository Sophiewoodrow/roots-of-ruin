"use strict";

(() => {
	const loadingScreen = document.getElementById("game-loading-screen");
	if (!loadingScreen) return;

	const revealGame = () => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				loadingScreen.classList.add("is-ready");
				loadingScreen.setAttribute("aria-hidden", "true");
			});
		});
	};

	/* Reveal the game only when Construct sends its real runtime-ready signal. */
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
