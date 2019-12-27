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
				satoshiPerBitcoin: 100000000
			};
			self.jsonToMatrix = function (json) {
				const ret = [];
				json.forEach(element => {
					const row = [];
					Object.keys(element).forEach(key => row.push(element[key]));
					ret.push(row);
				});
				return ret;
			};
			self.matrixToTable = function (header, matrix, applyOnElement) {
				const domTable = self.util.createElement('table');
				const domHeader = self.util.createElement('tr');
				header.forEach(value => domHeader.append(self.util.createElement('th', {textContent: value})));
				domTable.append(domHeader);
				matrix.forEach(row => {
					const domRow = self.util.createElement('tr');
					row.forEach((value, i) => {
						const domElement = self.util.createElement('td', {textContent: value}, ['col_' + i]);
						applyOnElement(row, domElement, i);
						domRow.append(domElement);
					});
					domTable.append(domRow);
				});
				return domTable;
			};
			self.convert = value => self.model.satoshiPerBitcoin / value;
			self.show = function () {
				document.querySelector('#title').textContent = self.model.title;
				document.querySelector('#sub-title').textContent = self.model.subTitle;
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
						if (row[2] > self.model.minValue) {
							if (i === 2) {
								domElement.classList.add('lost-element');
							} else {
								domElement.classList.add('lost');
							}
						}
					}
				);
				const domGenesis = self.util.createElement('div', {textContent: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'}, ['genesis']);
				const domFooter = self.util.createElement('div', null, ['footer']);
				const domDate = self.util.createElement('div', {textContent: theNow});
				const domGithub = self.util.createElement('a', {href: 'https://github.com/isghe/picco-bitcoin', textContent: 'GitHub: picco-bitcoin'});
				const domAddress = self.util.createElement('div', {textContent: '1p12pYog8jxVL3QaqevM4Gp32MZUoutck'});
				[domGenesis, domDate, domGithub, domAddress].forEach(dom => domFooter.append(dom));
				const domContainer = document.querySelector('#container');
				[domMatrix, domFooter].forEach(dom => domContainer.append(dom));
			};
		};
		gController = new ClassController(new Date());
		gController.show();
	});
})();
