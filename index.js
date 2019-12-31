/* eslint-disable no-alert */
/* eslint-disable capitalized-comments */
let gController = null;
(function () {
	'use strict';
	document.addEventListener('DOMContentLoaded', () => {
		const ClassController = function (theNow) {
			const self = this;
			self.util = {
				createElement(theTag, theProperties, theClassList) {
					const ret = document.createElement(theTag);
					if ((typeof undefined !== typeof theProperties) && (theProperties !== null)) {
						Object.keys(theProperties).forEach(theProperty => {
							ret[theProperty] = theProperties[theProperty];
						});
					}
					if ((typeof undefined !== typeof theClassList) && (theClassList !== null)) {
						theClassList.forEach(theClass => ret.classList.add(theClass));
					}
					return ret;
				}
			};
			self.model = {
				title: '#picco12',
				subTitle: '(#picco2020)',
				minValue: 8200,
				satoshiPerBitcoin: 100000000,
				columnSatoshiPerBitcoinIndex: 2
			};
			self.jsonToMatrix = json => json.map(element => Object.keys(element).map(key => element[key]));
			self.matrixToTable = (header, matrix, applyOnElement) => {
				const domTable = self.util.createElement('table');
				const domHeader = self.util.createElement('tr');
				header.forEach(value => domHeader.append(self.util.createElement('th', {textContent: value})));
				domTable.append(domHeader);
				matrix.forEach(row => {
					const domRow = self.util.createElement('tr');
					row.forEach((value, i) => domRow.append(applyOnElement(row, self.util.createElement('td', {textContent: value}, ['col_' + i]), i)));
					domTable.append(domRow);
				});
				return domTable;
			};
			self.convert = value => self.model.satoshiPerBitcoin / value;
			self.show = () => {
				const domHeader = self.util.createElement('div', null, ['header']);
				[self.util.createElement('h1', {id: 'title', textContent: self.model.title}),
				self.util.createElement('h2', {id: 'sub-title', textContent: self.model.subTitle})].forEach(dom => domHeader.append(dom));
				document.title = self.model.title;
				gData.sort((a, b) => b['satoshi/€'] - a['satoshi/€']); // eslint-disable-line no-undef
				const extraData = gData.map((row, i) => { // eslint-disable-line no-undef
					return {
						indice: i + 1,
						nome: row.nome,
						'satoshi/€': parseFloat(row['satoshi/€']).toFixed(2),
						'telegram-id': row['telegram-id'],
						'€/₿': parseFloat(self.convert(row['satoshi/€'])).toFixed(2)
					};
				});
				const domMatrix = self.matrixToTable(
					['indice', 'nome', 'satoshi/€', 'telegram-id', '€/₿'],
					self.jsonToMatrix(extraData),
					(row, domElement, i) => {
						if (row[self.model.columnSatoshiPerBitcoinIndex] > self.model.minValue) {
							const classes = ['lost', 'lost-element'];
							domElement.classList.add(classes[Number(i === self.model.columnSatoshiPerBitcoinIndex)]);
						}
						return domElement;
					}
				);
				const domFooter = self.util.createElement('div', null, ['footer']);
				[self.util.createElement('div', {textContent: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'}, ['genesis']),
				self.util.createElement('div', {textContent: theNow}),
				self.util.createElement('a', {href: 'https://github.com/isghe/picco-bitcoin', textContent: 'GitHub: picco-bitcoin'}),
				self.util.createElement('div', {textContent: '1p12pYog8jxVL3QaqevM4Gp32MZUoutck'})].forEach(dom => domFooter.append(dom));
				const domContainer = self.util.createElement('div', null, ['container']);
				[domHeader, domMatrix, domFooter].forEach(dom => domContainer.append(dom));
				document.body.append(domContainer);
			};
		};
		gController = new ClassController(new Date());
		gController.show();
	});
})();
