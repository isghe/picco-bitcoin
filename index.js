let gController = null; // gController useful just for easy debug
(function () {
	'use strict';
	document.addEventListener('DOMContentLoaded', () => {
		const ClassController = function (theNow) {
			const self = this; // eslint-disable-line unicorn/no-this-assignment
			self.util = {
				createElement(arg) {
					const $el = document.createElement(arg[0]);
					if ((typeof undefined !== typeof arg[1]) && (arg[1] !== null)) {
						Object.keys(arg[1]).forEach(theProperty => {
							$el[theProperty] = arg[1][theProperty];
						});
					}

					if ((typeof undefined !== typeof arg[2]) && (arg[2] !== null)) {
						arg[2].forEach(theClass => $el.classList.add(theClass));
					}

					return $el;
				},
			};
			self.model = gModel; // eslint-disable-line no-undef

			self.jsonToMatrix = json => json.map(element => Object.keys(element).map(key => element[key]));
			self.matrixToTable = (header, matrix, {threshold, absoluteThreshold, satoshiColIndex, separatorLabels}) => {
				const $table = self.util.createElement(['table']);
				const $header = self.util.createElement(['tr']);
				header.forEach(value => $header.append(self.util.createElement(['th', {textContent: value}])));
				$table.append($header);
				const insertSeparator = label => {
					const $sep = self.util.createElement(['tr', null, ['separator']]);
					$sep.append(self.util.createElement(['td', {textContent: label, colSpan: header.length}]));
					$table.append($sep);
				};

				let thresholdPassed = false;
				let absoluteThresholdPassed = false;
				let winnerMarked = false;
				let absoluteWinnerMarked = false;
				matrix.forEach(row => {
					const satoshi = self.infinityIfIsNaN(row[satoshiColIndex]);
					if (!thresholdPassed && satoshi <= threshold) {
						insertSeparator(separatorLabels.threshold);
						thresholdPassed = true;
					}

					if (!absoluteThresholdPassed && absoluteThreshold < threshold && satoshi <= absoluteThreshold) {
						insertSeparator(separatorLabels.absoluteThreshold);
						absoluteThresholdPassed = true;
					}

					const $row = self.util.createElement(['tr']);
					row.forEach((value, i) => $row.append(self.util.createElement(['td', {textContent: value}, ['col_' + i]])));
					$table.append($row);
					if (satoshi > absoluteThreshold) {
						$row.classList.add('lost-absolute');
					}

					if (satoshi > threshold) {
						$row.classList.add('lost');
					}

					if (thresholdPassed && !winnerMarked) {
						$row.classList.add('winner');
						winnerMarked = true;
					}

					if (absoluteThresholdPassed && !absoluteWinnerMarked) {
						$row.classList.add('winner-absolute');
						absoluteWinnerMarked = true;
					}

					if (typeof (row[5]) !== 'undefined') {
						$row.classList.add('penalita');
					}
				});
				return $table;
			};

			self.convert = value => self.model.constants.satoshiPerBitcoin / value;
			self.showFloat = value => Number.parseFloat(value).toFixed(2);
			self.getOrDefault = (params, field, defaultValue) => {
				let $el = params.get(field);
				if ($el === null) {
					$el = defaultValue;
				}

				return $el;
			};

			// with Number.isNaN instead of isNaN we have different wrong result.
			self.infinityIfIsNaN = value => [value, Number.POSITIVE_INFINITY][Number(Number.isNaN(Number(value)) === true)];
			self.show = () => {
				const url = new URL(location);
				const path = url.origin + url.pathname;
				console.log(path);
				const params = url.searchParams;
				self.model.current.annoGenesi = self.getOrDefault(params, 'picco', self.model.constants.defaultAnnoGenesi);
				const $favicon = document.querySelector('#favicon');
				const navigators = Object.keys(self.model.picco).map(key => ['a', {href: path + '?picco=' + key, textContent: '#picco' + key}, ['navigator']]);
				try {
					$favicon.setAttribute('href', 'favicons/' + self.model.picco[self.model.current.annoGenesi].favicon);
					const $header = self.util.createElement(['div', null, ['header']]);
					[['h1', {id: 'title', textContent: self.model.picco[self.model.current.annoGenesi].title}],
						['h2', {id: 'sub-title', textContent: self.model.picco[self.model.current.annoGenesi].subTitle}]].forEach(dom => $header.append(self.util.createElement(dom)));
					// document.title = self.model.picco[self.model.current.annoGenesi].title;
					self.model.picco[self.model.current.annoGenesi].data.sort((a, b) => self.infinityIfIsNaN(b[self.model.constants.fieldSatoshiEuro]) - self.infinityIfIsNaN(a[self.model.constants.fieldSatoshiEuro]));

					const currentMinValue = self.model.picco[self.model.current.annoGenesi].minValue;
					const absoluteMinValue = Math.min(...Object.values(self.model.picco).map(p => p.minValue));
					const absoluteMinEdition = Object.keys(self.model.picco).find(k => self.model.picco[k].minValue === absoluteMinValue);
					const header = ['indice', 'nome', self.model.constants.fieldSatoshiEuro, 'telegram-id', '€/₿', 'penalità'];
					const satoshiColIndex = header.indexOf(self.model.constants.fieldSatoshiEuro);
					const $matrix = self.matrixToTable(
						header,
						self.jsonToMatrix(self.model.picco[self.model.current.annoGenesi].data).map((row, i) => [(i + 1), row[0], self.showFloat(row[1]), row[2], self.showFloat(self.convert(row[1])), row[3]]),
						{
							threshold: currentMinValue,
							absoluteThreshold: absoluteMinValue,
							satoshiColIndex,
							separatorLabels: {
								threshold: `minimo #picco${self.model.current.annoGenesi}: ${self.showFloat(currentMinValue)} sat/€ · ${self.showFloat(self.convert(currentMinValue))} €/₿`,
								absoluteThreshold: `minimo assoluto #picco${absoluteMinEdition}: ${self.showFloat(absoluteMinValue)} sat/€ · ${self.showFloat(self.convert(absoluteMinValue))} €/₿`,
							},
						},
					);
					const $footer = self.util.createElement(['div', null, ['footer']]);
					[
						['div', {textContent: 'anno genesi ' + self.model.current.annoGenesi}],
						['div', {textContent: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'}, ['genesis']],
						['div', {textContent: theNow}],
						['a', {textContent: 'GitHub: picco-bitcoin', href: self.model.constants.repository}],
						['div', {textContent: self.model.constants.p2pkh}],
						...navigators,
						['h1', {textContent: '#p' + self.model.current.annoGenesi}],
					].forEach(dom => $footer.append(self.util.createElement(dom)));

					const $container = self.util.createElement(['div', null, ['container']]);
					// $container.append ([$header, $matrix, $footer]);
					[$header, $matrix, $footer].forEach(dom => $container.append(dom));
					document.body.append($container);
				} catch (error) {
					// alert (error);
					const $error = self.util.createElement(['div', {textContent: error}]);
					const $h1 = self.util.createElement(['h1', {textContent: '#p' + self.model.current.annoGenesi}]);
					const $container = self.util.createElement(['div', null, ['container']]);
					$container.append($h1);
					$container.append($error);
					document.body.append($container);
				}
			};
		};

		gController = new ClassController(new Date());
		gController.show();
	});
})();
