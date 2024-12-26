class Manager {
	tournaments = {};
	lastTournamentID = 0;

	constructor(io) {
		this.io = io;

		io.on('connection', (socket) => {
			console.log('connection');

			socket.on('createTournament', (initValue, cb) => {
				console.log('createTournament');
				cb(this.createRoom(initValue));
			});

			socket.on('joinTournament', (id, cb) => {
				console.log('joinTournament');

				if (this.tournaments[id]) {
					socket.join(`tournament-${id}`);
					cb(this.tournaments[id]);
				}
			});

			socket.on('updateTournament', (id, value) => {
				console.log('updateTournament', id);
				this.updateTournament(id, value);
			});
		});
	}

	createRoom(state) {
		this.lastTournamentID += 1;
		this.tournaments[this.lastTournamentID] = {state: state, history: []};

		return this.lastTournamentID;
	}

	updateTournament(id, value) {
		if (this.tournaments[id]) {
			this.tournaments[id] = value;
			this.io.to(`tournament-${id}`).emit('tournamentUpdated', value);
		}
	}
}

module.exports = Manager;
