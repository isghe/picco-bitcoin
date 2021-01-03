/* eslint-disable capitalized-comments */
let gController = null;
(function () {
	'use strict';
	document.addEventListener('DOMContentLoaded', () => {
		const ClassController = function (theNow) {
			const self = this;
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
				}
			};
			self.model = {
				current: {
					annoGenesi: null // self.getOrDefault(params, 'picco', '12'),
				},
				constants: {
					satoshiPerBitcoin: 100000000,
					columnSatoshiPerBitcoinIndex: 2,
					defaultAnnoGenesi: 12
				},
				picco: {
					12: {
						data: gData12, // eslint-disable-line no-undef
						title: '#picco12',
						subTitle: '(#picco2020)',
						favicon: 'p12.png',
						// minValue: 12540,
						// minValue: 11749.5, // 29 jan 2020
						// minValue: 9933.44, // 1 aug 2020
						// minValue: 8600.397166341141, // 27 oct 2020
						// minValue: 8486.522129879433, // 28 oct 2020
						// minValue: 6949.888523788079, // 17 nov 2020
						// minValue: 6652.284427733905, // 17 nov 2020
						// minValue: 6476.608433321373, // 18 nov 2020
						// minValue: 6306.927908029855, // 20 nov 2020
						// minValue: 6149.369412913553, // 24 nov 2020
						// minValue: 5473.573586723301, // 17 dec 2020
						// minValue: 5351.823526830297, // 17 dec 2020
						// minValue: 4943.938212637793, // 25 dec 2020
						// minValue: 4372.722085088799 // 27 dec 2020
						// minValue: 3947.58242157338 // 2 gen 2020
						// minValue: 3811.9663723574495 // 2 gennaio 2020
						// minValue: 3689.3167348513884 // 2 gennaio 2020
						minValue: 3499.909177356848 // 3 gennaio 2020
					},
					13: {
						data: gData13, // eslint-disable-line no-undef
						title: '#picco13',
						subTitle: '(#picco2021)',
						favicon: 'p13.png',
						minValue: Infinity // pre start
					}
				}
			};

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
			self.showFloat = value => parseFloat(value).toFixed(2);
			self.getOrDefault = (params, field, defaultValue) => {
				let ret = params.get(field);
				if (ret === null) {
					ret = defaultValue;
				}

				return ret;
			};

			self.infinityIfIsNaN = value => [value, Infinity][Number(isNaN(value) === true)];

			self.show = () => {
				const url = new URL(location);
				const path = url.origin + url.pathname;
				console.log(path);
				const params = url.searchParams;
				self.model.current.annoGenesi = self.getOrDefault(params, 'picco', self.model.constants.defaultAnnoGenesi);
				const favicon = document.getElementById('favicon');
				favicon.setAttribute('href', self.model.picco[self.model.current.annoGenesi].favicon);
				const domHeader = self.util.createElement(['div', null, ['header']]);
				[['h1', {id: 'title', textContent: self.model.picco[self.model.current.annoGenesi].title}],
				['h2', {id: 'sub-title', textContent: self.model.picco[self.model.current.annoGenesi].subTitle}]].forEach(dom => domHeader.append(self.util.createElement(dom)));
				// document.title = self.model.picco[self.model.current.annoGenesi].title;
				Object.keys(self.model.picco).forEach(key => {
					self.model.picco[key].data.sort((a, b) => self.infinityIfIsNaN(b['satoshi/€']) - self.infinityIfIsNaN(a['satoshi/€']));
				});
				// gData12.sort((a, b) => b['satoshi/€'] - a['satoshi/€']); // eslint-disable-line no-undef
				const domMatrix = self.matrixToTable(
					['indice', 'nome', 'satoshi/€', 'telegram-id', '€/₿', 'penalità'],
					self.jsonToMatrix(self.model.picco[self.model.current.annoGenesi].data).map((row, i) => [(i + 1), row[0], self.showFloat(row[1]), row[2], self.showFloat(self.convert(row[1])), row[3]]),
					(row, domElement, i) => {
						if (self.infinityIfIsNaN(row[self.model.constants.columnSatoshiPerBitcoinIndex]) > self.model.picco[self.model.current.annoGenesi].minValue) {
							const classes = ['lost', 'lost-element'];
							domElement.classList.add(classes[Number(i === self.model.constants.columnSatoshiPerBitcoinIndex)]);
						}
						return domElement;
					}
				);
				const domFooter = self.util.createElement(['div', null, ['footer']]);
				[
				['div', {textContent: 'anno genesi ' + self.model.current.annoGenesi}],
				['div', {textContent: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'}, ['genesis']],
				['div', {textContent: theNow}],
				['a', {href: 'https://github.com/isghe/picco-bitcoin', textContent: 'GitHub: picco-bitcoin'}],
				['div', {textContent: '1p12pYog8jxVL3QaqevM4Gp32MZUoutck'}]].forEach(dom => domFooter.append(self.util.createElement(dom)));
				const domContainer = self.util.createElement(['div', null, ['container']]);
				[domHeader, domMatrix, domFooter].forEach(dom => domContainer.append(dom));
				document.body.append(domContainer);
			};
		};
		gController = new ClassController(new Date());
		gController.show();
	});
})();
