import {Game} from 'game';
import {MasterGrid} from 'game';
import {Theme} from 'theme';

(function() {
	let app = angular.module('CodeGoblins', ['ui.router', 'ngMaterial']);

	app.config(($stateProvider, $urlRouterProvider, $mdThemingProvider) => {

		Theme.configure($mdThemingProvider);
		
		$urlRouterProvider.otherwise('/');

		$stateProvider.state('app', {
			abstract: true,
			views: {
				// 'footer': {
				// 	templateUrl: 'game/footer.html'
				// }
			}
		})
		.state('app.select', {
			url: '/',
			views: {
				'content@': {
					templateUrl: 'game/select.html'		
				}
			}
		})
		.state('app.spy-master', {
			url: '/sm',
			views: {
				'content@': {
					templateUrl: 'game/spy-master.html',
					controller: SpyMasterController
				}
			}
		})
		.state('app.game-board', {
			url: '/game',
			views: {
				'content@': {
					templateUrl: 'game/game.html',
					controller: GameController
				}
			}
		});
	});

})();

class GameController {
	constructor($scope) {
		$scope.game = new Game();
		$scope.showMasterCode = true;

		$scope.newGame = () => { 
			$scope.game = new Game(); 
			$scope.showMasterCode = true;
		}

		$scope.hideMasterCode = () => {
			$scope.showMasterCode = false;
		}
	}
}

class SpyMasterController {
	constructor($scope) {
		$scope.masterCode = '';
		$scope.error = '';

		$scope.loadGame = () => {
			$scope.error = '';
			$scope.master = new MasterGrid($scope.masterCode);
			if (!$scope.master.valid) {
				$scope.error = 'Invalid Game Code';
			}
		}
	}
}