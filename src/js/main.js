import {Game} from 'game';
import {MasterGrid} from 'game';
import {Theme} from 'theme';

(function() {
	let app = angular.module('CodeGoblins', ['ui.router']);

	app.config(($stateProvider, $urlRouterProvider) => {
		
		$urlRouterProvider.otherwise('/');

		$stateProvider.state('app', {
			abstract: true,
			views: {
				'footer': {
					templateUrl: 'game/footer.html'
				}
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
		})
		.state('app.instructions', {
			url: '/instructions',
			views: {
				'content@': {
					templateUrl: 'game/instructions.html'
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
		$scope.loadGame = () => {
			$scope.error = '';
			$scope.master = new MasterGrid($scope.masterCode);
			if (!$scope.master.valid) {
				$scope.error = 'Invalid Game Code';
			} else {
				$scope.initialized = true;
			}
		}

		$scope.newGame = () => {
			$scope.master = null;
			$scope.masterCode = '';
			$scope.error = '';
			$scope.initialized = false;
		}

		$scope.newGame();
	}
}