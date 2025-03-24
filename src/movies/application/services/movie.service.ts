import { Inject, Injectable } from '@nestjs/common';
import { MovieRepository } from '@movies/domain/repositories/movie.repository';
import { MovieAlreadyExistsError, MovieNotFoundError } from '@movies/domain/errors/movie.error';
import { Movie } from '@movies/domain/entities/movie.entity';
import { NewMovie, UpdateMovieRepository } from '@movies/domain/interfaces/movie.interface';

@Injectable()
export class MovieService {
	constructor(@Inject('MovieRepository') private readonly movieRepository: MovieRepository) {}

	async createMovie(movieToCreate: NewMovie): Promise<Movie> {
		const movie = await this.movieRepository.getBy({ episodeId: movieToCreate.episodeId });

		if (movie) throw new MovieAlreadyExistsError();

		return this.movieRepository.create(movieToCreate);
	}

	getById(id: string) {
		return this.movieRepository.getBy({ id });
	}

	async update(id: string, movieToUpdate: UpdateMovieRepository): Promise<Movie> {
		await this.validateMovie(id);
		return this.movieRepository.update(id, movieToUpdate);
	}

	async delete(id: string): Promise<void> {
		await this.validateMovie(id);
		await this.movieRepository.update(id, { deletedAt: new Date().toISOString() });
	}

	async list(): Promise<Movie[]> {
		return this.movieRepository.list();
	}

	private async validateMovie(id: string): Promise<void> {
		const movie = await this.getById(id);

		if (!movie || movie.deletedAt) throw new MovieNotFoundError();
	}
}
