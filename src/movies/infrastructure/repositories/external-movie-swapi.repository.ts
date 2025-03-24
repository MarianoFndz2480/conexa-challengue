import { Injectable } from '@nestjs/common';
import { ExternalMovieRepository } from '@movies/domain/repositories/external-movie.repository';
import { SWAPIMovie, SWAPIResponse } from '@movies/infrastructure/interfaces/swapi-responses.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NewMovie } from '@movies/domain/interfaces/movie.interface';

@Injectable()
export class SWAPIExternalMovieRepository implements ExternalMovieRepository {
	private readonly SWAPI_URL = 'https://swapi.dev/api/films/';

	constructor(private readonly httpService: HttpService) {}

	async getMovies(): Promise<NewMovie[]> {
		const response = await firstValueFrom(this.httpService.get<SWAPIResponse>(this.SWAPI_URL));
		return response.data.results.map(this.mapMovie);
	}

	private mapMovie(swapiMovie: SWAPIMovie): NewMovie {
		return {
			title: swapiMovie.title,
			episodeId: swapiMovie.episode_id,
			openingCrawl: swapiMovie.opening_crawl,
			director: swapiMovie.director,
			producer: swapiMovie.producer,
			releaseDate: swapiMovie.release_date,
			url: swapiMovie.url,
		};
	}
}
