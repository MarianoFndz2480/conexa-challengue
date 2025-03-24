import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MovieService } from '@movies/application/services/movie.service';
import { ExternalMovieRepository } from '@app/movies/domain/repositories/external-movie.repository';
import { NewMovie } from '@movies/domain/interfaces/movie.interface';

@Injectable()
export class SyncMoviesCron {
	private readonly logger = new Logger(SyncMoviesCron.name);

	constructor(
		@Inject('ExternalMovieRepository') private readonly externalMovieRepository: ExternalMovieRepository,
		private readonly movieService: MovieService,
	) {}

	@Cron(CronExpression.EVERY_MINUTE)
	async syncMovies() {
		try {
			this.logger.log('Starting movies synchronization...');

			const externalMovies = await this.externalMovieRepository.getMovies();

			await this.syncExternalMovies(externalMovies);

			this.logger.log('Movies synchronization completed');
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.logger.error(`Synchronization failed: ${error.message}`);
			}
		}
	}

	private async syncExternalMovies(externalMovies: NewMovie[]) {
		for (const movie of externalMovies) {
			try {
				await this.movieService.createMovie(movie);
			} catch (error: unknown) {
				if (error instanceof Error && error.name !== 'MovieAlreadyExistsError') {
					this.logger.error(`Error syncing movie ${movie.title}: ${error.message}`);
				}
			}
		}
	}
}
