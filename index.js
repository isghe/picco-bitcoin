let gController = null; // gController useful just for easy debug
(function () {
	'use strict';
	document.addEventListener('DOMContentLoaded', () => {
		const ClassController = function (theNow) {
			const self = this; // eslint-disable-line unicorn/no-this-assignment
			self.util = {
				createElement(arg) {
					const ret = document.createElement(arg[0]);
					if ((typeof undefined !== typeof arg[1]) && (arg[1] !== null)) {
						Object.keys(arg[1]).forEach(theProperty => {
							ret[theProperty] = arg[1][theProperty];
						});
					}

					if ((typeof undefined !== typeof arg[2]) && (arg[2] !== null)) {
						arg[2].forEach(theClass => ret.classList.add(theClass));
					}

					return ret;
				},
			};
			self.model = gModel; // eslint-disable-line no-undef

			self.jsonToMatrix = json => json.map(element => Object.keys(element).map(key => element[key]));
			self.matrixToTable = (header, matrix, applyOnElement) => {
				const domTable = self.util.createElement(['table']);
				const domHeader = self.util.createElement(['tr']);
				header.forEach(value => domHeader.append(self.util.createElement(['th', {textContent: value}])));
				domTable.append(domHeader);
				matrix.forEach(row => {
					const domRow = self.util.createElement(['tr']);
					row.forEach((value, i) => domRow.append(applyOnElement(row, self.util.createElement(['td', {textContent: value}, ['col_' + i]]), i)));
					domTable.append(domRow);
					if (typeof (row[5]) !== 'undefined') {
						domRow.classList.add('penalita');
					}
				});
				return domTable;
			};

			self.convert = value => self.model.constants.satoshiPerBitcoin / value;
			self.showFloat = value => Number.parseFloat(value).toFixed(2);
			self.getOrDefault = (params, field, defaultValue) => {
				let ret = params.get(field);
				if (ret === null) {
					ret = defaultValue;
				}

				return ret;
			};

			// with Number.isNaN instead of isNaN we have different wrong result.
			self.infinityIfIsNaN = value => [value, Number.POSITIVE_INFINITY][Number(Number.isNaN(Number(value)) === true)];
			self.show = () => {
				const url = new URL(location);
				const path = url.origin + url.pathname;
				console.log(path);
				const params = url.searchParams;
				self.model.current.annoGenesi = self.getOrDefault(params, 'picco', self.model.constants.defaultAnnoGenesi);
				const favicon = document.querySelector('#favicon');
				favicon.setAttribute('href', 'favicons/'+self.model.picco[self.model.current.annoGenesi].favicon);
				const domHeader = self.util.createElement(['div', null, ['header']]);
				[['h1', {id: 'title', textContent: self.model.picco[self.model.current.annoGenesi].title}],
					['h2', {id: 'sub-title', textContent: self.model.picco[self.model.current.annoGenesi].subTitle}]].forEach(dom => domHeader.append(self.util.createElement(dom)));
				// document.title = self.model.picco[self.model.current.annoGenesi].title;
				Object.keys(self.model.picco).forEach(key => {
					self.model.picco[key].data.sort((a, b) => self.infinityIfIsNaN(b[self.model.constants.fieldSatoshiEuro]) - self.infinityIfIsNaN(a[self.model.constants.fieldSatoshiEuro]));
				});
				const navigators = Object.keys(self.model.picco).map(key => ['a', {href: path + '?picco=' + key, textContent: '#picco' + key}, ['navigator']]);
				const $navigators = navigators.map(args => self.util.createElement(args));

				// gData12.sort((a, b) => b['satoshi/€'] - a['satoshi/€']); // eslint-disable-line no-undef
				const domMatrix = self.matrixToTable(
					['indice', 'nome', self.model.constants.fieldSatoshiEuro, 'telegram-id', '€/₿', 'penalità'],
					self.jsonToMatrix(self.model.picco[self.model.current.annoGenesi].data).map((row, i) => [(i + 1), row[0], self.showFloat(row[1]), row[2], self.showFloat(self.convert(row[1])), row[3]]),
					(row, domElement, i) => {
						if (self.infinityIfIsNaN(row[self.model.constants.columnSatoshiPerBitcoinIndex]) > self.model.picco[self.model.current.annoGenesi].minValue) {
							const classes = ['lost', 'lost-element'];
							domElement.classList.add(classes[Number(i === self.model.constants.columnSatoshiPerBitcoinIndex)]);
						}

						return domElement;
					},
				);
				const domFooter = self.util.createElement(['div', null, ['footer']]);
				[
					['div', {textContent: 'anno genesi ' + self.model.current.annoGenesi}],
					['div', {textContent: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'}, ['genesis']],
					['div', {textContent: theNow}],
					['a', {href: 'https://github.com/isghe/picco-bitcoin', textContent: 'GitHub: picco-bitcoin'}],
					['div', {textContent: '1p12pYog8jxVL3QaqevM4Gp32MZUoutck'}],
				].forEach(dom => domFooter.append(self.util.createElement(dom)));
				$navigators.forEach($navigator => {
					domFooter.append($navigator);
				});
				const domContainer = self.util.createElement(['div', null, ['container']]);
				const domPX = self.util.createElement(['h1', {textContent: '#p' + self.model.current.annoGenesi}]);
				[domHeader, domMatrix, domFooter, domPX].forEach(dom => domContainer.append(dom));
				document.body.append(domContainer);
			};
		};

		gController = new ClassController(new Date());
		gController.show();
	});
})();
