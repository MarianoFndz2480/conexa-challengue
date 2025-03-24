import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MovieService } from '@movies/application/services/movie.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NewMovie } from '@movies/domain/interfaces/movie.interface';

interface SWAPIResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: SWAPIMovie[];
}

interface SWAPIMovie {
	title: string;
	episode_id: number;
	opening_crawl: string;
	director: string;
	producer: string;
	release_date: string;
	url: string;
}

@Injectable()
export class SyncMoviesCron {
	private readonly logger = new Logger(SyncMoviesCron.name);
	private readonly SWAPI_URL = 'https://swapi.dev/api/films/';

	constructor(
		private readonly movieService: MovieService,
		private readonly httpService: HttpService,
	) {}

	@Cron(CronExpression.EVERY_MINUTE)
	async syncMovies() {
		try {
			this.logger.log('Starting movies synchronization...');

			const response = await firstValueFrom(this.httpService.get<SWAPIResponse>(this.SWAPI_URL));

			for (const movie of response.data.results) {
				try {
					await this.syncMovie(movie);
				} catch (error: unknown) {
					if (error instanceof Error && error.name !== 'MovieAlreadyExistsError') {
						this.logger.error(`Error syncing movie ${movie.title}: ${error.message}`);
					}
				}
			}

			this.logger.log('Movies synchronization completed');
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.logger.error(`Synchronization failed: ${error.message}`);
			}
		}
	}

	private async syncMovie(swapiMovie: SWAPIMovie): Promise<void> {
		const newMovie: NewMovie = {
			title: swapiMovie.title,
			episodeId: swapiMovie.episode_id,
			openingCrawl: swapiMovie.opening_crawl,
			director: swapiMovie.director,
			producer: swapiMovie.producer,
			releaseDate: swapiMovie.release_date,
			url: swapiMovie.url,
		};

		await this.movieService.createMovie(newMovie);
	}
}
