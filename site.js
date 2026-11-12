// Tab switching for the worksheet views, with the arrow-key behaviour a
	// tablist is expected to have. No library: three buttons and a hidden
	// attribute do not need one.
	(function () {
		document.querySelectorAll('.views').forEach(function (list) {
		var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
		function select(tab, focus) {
			tabs.forEach(function (t) {
				var on = t === tab;
				t.setAttribute('aria-selected', on ? 'true' : 'false');
				t.tabIndex = on ? 0 : -1;
				var panel = document.getElementById(t.getAttribute('aria-controls'));
				if (panel) panel.hidden = !on;
			});
			if (focus) tab.focus();
		}
		list.addEventListener('click', function (e) {
			var tab = e.target.closest('[role="tab"]');
			if (tab) select(tab, false);
		});
		list.addEventListener('keydown', function (e) {
			var i = tabs.indexOf(document.activeElement);
			if (i < 0) return;
			if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
				e.preventDefault();
				select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
			} else if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
			else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
		});
		});
	})();

	// Demo request form. Posts to Web3Forms, the same service the XWARE site
	// uses. The access key is not a secret -- it travels from the browser on
	// every submit and identifies the destination inbox, nothing more.
	(function () {
		var ACCESS_KEY = '67f03824-0402-4505-bae0-a7855fdd9a06';
		var form = document.getElementById('demo-form');
		if (!form) return;
		document.querySelectorAll('a[href="#contact"]').forEach(function (a) {
			a.addEventListener('click', function () {
				var subj = document.getElementById('f-subject');
				if (subj && !subj.value) subj.value = a.textContent.trim();
			});
		});
		var status = document.getElementById('f-status');
		var submit = document.getElementById('f-submit');

		function setError(input, on) {
			input.setAttribute('aria-invalid', on ? 'true' : 'false');
			var err = document.getElementById('e-' + input.id.slice(2));
			if (err) err.setAttribute('data-show', on ? '1' : '0');
		}
		function validate() {
			var ok = true, first = null;
			['f-name', 'f-email', 'f-company', 'f-subject', 'f-message'].forEach(function (id) {
				var el = document.getElementById(id);
				var bad = !el.value.trim() || (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
				setError(el, bad);
				if (bad && !first) first = el;
				if (bad) ok = false;
			});
			if (first) first.focus();
			return ok;
		}
		function say(state, text) {
			status.hidden = false;
			status.setAttribute('data-state', state);
			status.textContent = text;
		}

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			if (!validate()) return;
			submit.disabled = true;
			submit.textContent = 'Sending…';
			var data = new FormData(form);
			data.append('access_key', ACCESS_KEY);
			data.append('from_name', 'aegix.eu: ' + (data.get('company') || 'contact form'));
			fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
				.then(function (r) { return r.json(); })
				.then(function (res) {
					if (res.success) {
						form.querySelector('.form-grid').hidden = true;
						form.querySelector('.actions').hidden = true;
						say('success', 'Thank you. We have your request and will come back to arrange a time.');
					} else {
						say('error', 'We could not send that. Please try again, or write to hello@aegix.eu.');
						submit.disabled = false;
						submit.textContent = 'Send message';
					}
				})
				.catch(function () {
					say('error', 'We could not send that. Please try again, or write to hello@aegix.eu.');
					submit.disabled = false;
					submit.textContent = 'Send message';
				});
		});
	})();

	// Analytics, opt-in as on finix.xware.be: nothing is loaded until the
	// visitor accepts. No cookie, no request, nothing recorded before that.
	// The Cookies button in the footer reopens the bar to change the choice.
	(function () {
		var KEY = 'aegix-analytics-consent';
		var banner = document.getElementById('consent');
		if (!banner) return;
		var stored = null;
		try { stored = localStorage.getItem(KEY); } catch (e) {}
		var started = false;

		function start() {
			if (started) return;
			started = true;
			(function (c, l, a, r, i, t, y) {
				c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
				t = l.createElement(r); t.async = 1;
				t.src = 'https://www.clarity.ms/tag/' + i;
				y = l.getElementsByTagName(r)[0];
				y.parentNode.insertBefore(t, y);
			})(window, document, 'clarity', 'script', 'yt1vdwre6g');
		}
		function remember(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
		function stop() {
			// Clarity's own revocation call, then its two cookies go. The script
			// that already ran stays until the page is left; the stored choice
			// keeps it from loading again.
			try { if (window.clarity) window.clarity('consent', false); } catch (e) {}
			['_clck', '_clsk'].forEach(function (name) {
				document.cookie = name + '=; Max-Age=0; path=/; domain=' + location.hostname.replace(/^www\./, '.');
				document.cookie = name + '=; Max-Age=0; path=/';
			});
		}

		if (stored === 'granted') start();
		if (stored === null) banner.hidden = false;

		document.getElementById('consent-accept').addEventListener('click', function () {
			remember('granted'); banner.hidden = true; start();
		});
		document.getElementById('consent-decline').addEventListener('click', function () {
			remember('denied'); banner.hidden = true; stop();
		});
		var settings = document.getElementById('cookie-settings');
		if (settings) settings.addEventListener('click', function () { banner.hidden = false; });
	})();

	// Mobile disclosure. Closing on link click matters because every entry
	// but "Sign in" is an in-page anchor: without it the panel would stay
	// open over the section it just jumped to.
	(function () {
		var toggle = document.getElementById('nav-toggle');
		var menu = document.getElementById('nav-menu');
		if (!toggle || !menu) return;
		function set(open) {
			menu.hidden = !open;
			toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
		}
		toggle.addEventListener('click', function () { set(menu.hidden); });
		menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && !menu.hidden) { set(false); toggle.focus(); }
		});
		window.addEventListener('resize', function () {
			if (window.innerWidth > 960 && !menu.hidden) set(false);
		});
	})();
