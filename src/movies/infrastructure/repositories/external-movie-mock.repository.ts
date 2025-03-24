import { Injectable } from '@nestjs/common';
import { ExternalMovieRepository } from '@movies/domain/repositories/external-movie.repository';
import { NewMovie } from '@movies/domain/interfaces/movie.interface';
import { newMoviesMockData } from '../mock-data/movie.mock-data';

@Injectable()
export class ExternalMovieMockRepository implements ExternalMovieRepository {
	async getMovies(): Promise<NewMovie[]> {
		return Promise.resolve(newMoviesMockData);
	}
}
