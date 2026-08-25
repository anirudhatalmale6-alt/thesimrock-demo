/* La file d'attente de la voie gratuite.
 *
 * Le compte a rebours est un effet de presentation, PAS une securite : le lien
 * reel n'est jamais dans la page avant la fin, et le serveur revalide le jeton
 * de toute facon. Quelqu'un qui triche avec la console n'obtient rien de plus
 * que le fichier gratuit qu'il aurait eu en attendant.
 */
(function () {
	'use strict';

	var boutons = document.querySelectorAll('.sr-btn-free[data-sr-url]');
	Array.prototype.forEach.call(boutons, function (b) {
		b.addEventListener('click', function () {
			if (b.dataset.srEnCours === '1') { return; }
			b.dataset.srEnCours = '1';

			var reste = parseInt(b.dataset.srAttente, 10) || 0;
			var url = b.dataset.srUrl;
			var libelle = b.dataset.srLibelle || b.textContent;

			if (reste <= 0) { window.location.href = url; return; }

			b.disabled = true;
			b.classList.add('sr-attente');

			var tic = function () {
				if (reste <= 0) {
					b.textContent = libelle;
					b.disabled = false;
					b.classList.remove('sr-attente');
					b.dataset.srEnCours = '0';
					window.location.href = url;
					return;
				}
				/* aria-live sur le bouton : sans ca, un lecteur d'ecran
				   n'annonce jamais que l'attente avance. */
				b.textContent = b.dataset.srTexte
					? b.dataset.srTexte.replace('%d', reste)
					: reste + 's';
				reste--;
				window.setTimeout(tic, 1000);
			};
			tic();
		});
	});

	/* Le filtre du catalogue : il masque ce qui est deja dans la page, il ne
	   recharge rien. Sans JavaScript la liste complete reste lisible. */
	var champ = document.querySelector('#sr-filtre-q');
	if (champ) {
		var plat = function (s) {
			return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
		};
		var cartes = document.querySelectorAll('.sr-carte');
		var compte = document.querySelector('#sr-compte');
		champ.addEventListener('input', function () {
			var q = plat(champ.value.trim());
			var n = 0;
			Array.prototype.forEach.call(cartes, function (c) {
				var ok = !q || plat(c.dataset.srRech).indexOf(q) !== -1;
				c.hidden = !ok;
				if (ok) { n++; }
			});
			if (compte) { compte.textContent = n; }
		});
	}
})();
