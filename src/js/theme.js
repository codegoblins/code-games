export class Theme {

	constructor() {}

	static configure($mdThemingProvider) {
		var customPrimary = {
			'50': '#528ebb',
			'100': '#4581af',
			'200': '#3e739d',
			'300': '#36668b',
			'400': '#2f5878',
			'500': '#284B66',
			'600': '#213e54',
			'700': '#1a3041',
			'800': '#12232f',
			'900': '#0b151d',
			'A100': '#659ac2',
			'A200': '#77a6ca',
			'A400': '#89b2d1',
			'A700': '#04080a'
		};
		$mdThemingProvider
			.definePalette('customPrimary', 
							customPrimary);

		var customAccent = {
			'50': '#2d1010',
			'100': '#401616',
			'200': '#531d1d',
			'300': '#662323',
			'400': '#792a2a',
			'500': '#8c3030',
			'600': '#b23e3e',
			'700': '#c04949',
			'800': '#c75c5c',
			'900': '#cd6f6f',
			'A100': '#b23e3e',
			'A200': '#9F3737',
			'A400': '#8c3030',
			'A700': '#d48282'
		};
		$mdThemingProvider
			.definePalette('customAccent', 
							customAccent);

		var customWarn = {
			'50': '#a251be',
			'100': '#9643b3',
			'200': '#873ca1',
			'300': '#77358e',
			'400': '#682e7c',
			'500': '#582769',
			'600': '#482056',
			'700': '#391944',
			'800': '#291231',
			'900': '#1a0b1f',
			'A100': '#ac64c5',
			'A200': '#b676cc',
			'A400': '#c089d3',
			'A700': '#0a040c'
		};
		$mdThemingProvider
			.definePalette('customWarn', 
							customWarn);

		var customBackground = {
			'50': '#737373',
			'100': '#666666',
			'200': '#595959',
			'300': '#4d4d4d',
			'400': '#404040',
			'500': '#333',
			'600': '#262626',
			'700': '#1a1a1a',
			'800': '#0d0d0d',
			'900': '#000000',
			'A100': '#808080',
			'A200': '#8c8c8c',
			'A400': '#999999',
			'A700': '#000000'
		};
		$mdThemingProvider
			.definePalette('customBackground', 
							customBackground);

	   $mdThemingProvider.theme('default')
		   .primaryPalette('customPrimary')
		   .accentPalette('customAccent')
		   .warnPalette('customWarn')
		   .backgroundPalette('customBackground');
   }
}