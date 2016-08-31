import {words as list_of_words} from '../data/words';

const total_grid_items = 25;
const grid_height = 5;
const grid_width = 5;
const total_red_needs_to_win = 8;
const total_blue_needs_to_win = 7;
const total_greys = 9;
const total_blacks = 1;


const codex = {
	'grey': 0,
	'red': 1,
	'blue': 2,
	'black': 3
};

const codex_key = ['grey', 'red', 'blue', 'black'];

export class Game {

	constructor() {

		this.grid = new GameGrid();
		this.rows = this.grid.getRows();

		this.gameOver = false;
		this.remainingReds = total_red_needs_to_win;
		this.remainingBlues = total_blue_needs_to_win;

		this.keyUrl = this.grid.encode();
	}

	select(x, y) {
		let tile = this.grid.at(x,y);

		if (!this.gameOver && !tile.chosen) {
			let team = tile.team;
			tile.chosen = true;

			if (team == 'black') {
				this.gameOver = true;
				this.winner = 'black';
			} else {

				if (team == 'red') {
					this.remainingReds--;
					if (this.remainingReds == 0) {
						this.winner = 'red';
						this.gameOver = true;
					}
				} else if (team == 'blue') {
					this.remainingBlues--;
					if (this.remainingBlues == 0) {
						this.winner = 'blue';
						this.gameOver = true;
					}
				}
			}
		}
	}
}

class GameGrid { 
	constructor() {
		let grid = new Array(5);
		
		let words = GameGrid.generateWords();
		words = GameGrid.shuffle(words);

		let position = 0;
		for (var x = 0; x < grid_width; x++) {
			grid[x] = new Array(grid_height);

			for (var y = 0; y < 5; y++) {
				grid[x][y] = { 
					word: words[position],
					chosen: false
				};
				position++;
			}
		}

		grid = GameGrid.assignWordsToTeams(grid);

		this._grid = grid;
	}

	at(x,y) {
		return this._grid[x][y];
	}

	getRows() {
		return this._grid;
	}

	// Encodes the team for each tile (4 possible "teams" -> 2 bits needed)
	// we need 50 bits total for a 5x5 grid (so 2 32-bit integers)
	// avoid the top 2 bits since JS uses signed integers
	// encoded_hi will have the first 3 rows (30 bits), and encoded_lo the bottom 2 (20 bits)
	// the result is 2 base-36 strings separated by a '.' to have the smallest character representation
	encode() {
		let encoded_hi = 0;
		let encoded_lo = 0;
		let total = 0;

		for (var x = 0; x < grid_width; x++) {
			let row = this._grid[x];
			row.forEach((item) => {
				if (total < 30) {
					encoded_hi = (encoded_hi << 2) | codex[item.team];	
				} else {
					encoded_lo = (encoded_lo << 2) | codex[item.team];
				}
				total += 2;
			});
		}
		return `${encoded_hi.toString(36)}.${encoded_lo.toString(36)}`;
	}

	static assignWordsToTeams(grid) {
		var reds = total_red_needs_to_win,
			blues = total_blue_needs_to_win,
			greys = total_greys,
			blacks = total_blacks;

		var positionsList = [];
		for (var i = 0; i < total_grid_items; i++) { positionsList[i] = i; }

		positionsList = GameGrid.shuffle(positionsList);

		let assignTeam = (team, start, total) => {
			for (var i = start; i < total + start; i++) {
				let pos = positionsList[i];

				let x = Math.floor(pos / grid_width);
				let y = pos % grid_width;

				grid[x][y].team = team;
			}
		}

		assignTeam('red', 0, reds);
		assignTeam('blue', reds, blues);
		assignTeam('grey', reds + blues, greys);
		assignTeam('black', reds + blues + greys, blacks);

		return grid;
	}

	static generateWords() {
		let total = 0;
		let words = [];

		var indices = [];
		while (indices.length < total_grid_items) {
			let randomnumber = Math.floor(Math.random() * list_of_words.length)
			let found = false;
			for (var i=0; i<indices.length; i++) {
				if (indices[i] == randomnumber) { 
					found = true;
					break
				}
			}
			if (!found) indices.push(randomnumber);
		}

		indices.forEach((i) => { words.push(list_of_words[i]); })

		return words;
	}

	// Durstenfeld Shuffle
	static shuffle(array) {
		for (var i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let temp = array[i];
			array[i] = array[j];
			array[j] = temp;
    	}
    	return array;
	}
	
}

export class MasterGrid {
	constructor(encoded) {
		this.rows = MasterGrid.decodeGrid(encoded);
		this.valid = !!this.rows;
	}

	static decodeGrid(encoded) {
		if (encoded && typeof(encoded) == 'string') {
			let encoded_parts = encoded.split('.');
			let encoded_hi = encoded_parts[0],
				encoded_lo = encoded_parts[1];

			// Encoded Hi: the top 30 bits (first 15 cards - [0,0]-[2,4])
			// Encoded Lo: the bottom 20 bits (last 9 cards - [3,0]-[4,4])
			encoded_hi = parseInt(encoded_hi, 36);
			encoded_lo = parseInt(encoded_lo, 36);

			let teams = [],
				teams_hi = [],
				teams_lo = [];

			for (var i = 0; i < total_grid_items; i++) {
				let bits = 0;
				
				if (i < 15) {
					bits = encoded_hi & 0b11;
					encoded_hi = encoded_hi >>> 2;
					teams_hi.push(codex_key[bits]);
				} else {
					bits = encoded_lo & 0b11;
					encoded_lo = encoded_lo >>> 2;
					teams_lo.push(codex_key[bits]);
				}
			}
			teams = teams.concat(teams_hi.reverse());
			teams = teams.concat(teams_lo.reverse());

			let grid = new Array(5);

			let position = 0;
			let teamTotals = {
				'red': 0,
				'blue': 0,
				'grey': 0,
				'black': 0
			};

			for (var x = 0; x < grid_height; x++) {
				grid[x] = new Array(grid_width);

				for (var y = 0; y < grid_width; y++) {
					let team = teams[position];

					grid[x][y] = { 
						team: team
					};
					teamTotals[team]++;
					position++;
				}
			}

			if (MasterGrid.verifyGameTotals(teamTotals)) {
				return grid;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	static verifyGameTotals(totals) {
		return (
			totals['red'] == total_red_needs_to_win &&
			totals['blue'] == total_blue_needs_to_win &&
			totals['grey'] == total_greys &&
			totals['black'] == total_blacks
		);
	}
}
