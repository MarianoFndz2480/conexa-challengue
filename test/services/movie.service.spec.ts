import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from '@movies/application/services/movie.service';
import { MovieRepository } from '@movies/domain/repositories/movie.repository';
import { MovieMockRepository } from '@movies/infrastructure/repositories/movie-mock.repository';
import { MovieAlreadyExistsError, MovieNotFoundError } from '@movies/domain/errors/movie.error';
import { movieMockData } from '@movies/infrastructure/mock-data/movie.mock-data';
import { CreateMovieDTO } from '@movies/infrastructure/dtos/movie.dto';

describe('MovieService tests:', () => {
	let movieService: MovieService;
	let movieRepository: MovieRepository;
	let getByMovieSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MovieService, { provide: 'MovieRepository', useClass: MovieMockRepository }],
		}).compile();

		movieService = module.get<MovieService>(MovieService);
		movieRepository = module.get<MovieRepository>('MovieRepository');
		getByMovieSpy = jest.spyOn(movieRepository, 'getBy');
	});

	afterEach(() => {
		getByMovieSpy.mockClear();
	});

	describe('createMovie method:', () => {
		it('Should create a new movie if episodeId does not exist', async () => {
			const createSpy = jest.spyOn(movieRepository, 'create');
			getByMovieSpy.mockResolvedValue(null);

			const movieData: CreateMovieDTO = {
				title: 'New Movie',
				episodeId: 999,
				openingCrawl: 'Test crawl',
				director: 'Test Director',
				producer: 'Test Producer',
				releaseDate: '2024-01-01',
				url: 'http://test.com',
			};

			const result = await movieService.createMovie(movieData);

			expect(result).toBeDefined();
			expect(createSpy).toHaveBeenCalledWith(movieData);
		});

		it('Should throw MovieAlreadyExistsError if episodeId already exists', async () => {
			getByMovieSpy.mockResolvedValue(movieMockData);

			const movieData: CreateMovieDTO = {
				title: 'New Movie',
				episodeId: 1,
				openingCrawl: 'Test crawl',
				director: 'Test Director',
				producer: 'Test Producer',
				releaseDate: '2024-01-01',
				url: 'http://test.com',
			};

			await expect(movieService.createMovie(movieData)).rejects.toThrow(MovieAlreadyExistsError);
		});
	});

	describe('getById method:', () => {
		it('Should return movie when id exists', async () => {
			getByMovieSpy.mockResolvedValue(movieMockData);

			const result = await movieService.getById(movieMockData.id);

			expect(result).toEqual(movieMockData);
			expect(getByMovieSpy).toHaveBeenCalledWith({ id: movieMockData.id });
		});

		it('Should return null when id does not exist', async () => {
			getByMovieSpy.mockResolvedValue(null);
			const id = 'nonexistent-id';

			const result = await movieService.getById(id);

			expect(result).toBeNull();
			expect(getByMovieSpy).toHaveBeenCalledWith({ id });
		});
	});

	describe('update method:', () => {
		it('Should update movie when id exists', async () => {
			const updateSpy = jest.spyOn(movieRepository, 'update');
			getByMovieSpy.mockResolvedValue(movieMockData);

			const updateData = { title: 'Updated Title' };
			await movieService.update(movieMockData.id, updateData);

			expect(updateSpy).toHaveBeenCalledWith(movieMockData.id, updateData);
		});

		it('Should throw MovieNotFoundError when id does not exist', async () => {
			getByMovieSpy.mockResolvedValue(null);
			const id = 'nonexistent-id';

			await expect(movieService.update(id, { title: 'Test' })).rejects.toThrow(MovieNotFoundError);
		});
	});

	describe('delete method:', () => {
		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date('2024-01-01'));
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('Should soft delete movie when id exists', async () => {
			const updateSpy = jest.spyOn(movieRepository, 'update');
			getByMovieSpy.mockResolvedValue(movieMockData);

			await movieService.delete(movieMockData.id);

			expect(updateSpy).toHaveBeenCalledWith(movieMockData.id, {
				deletedAt: '2024-01-01T00:00:00.000Z',
			});
		});

		it('Should throw MovieNotFoundError when id does not exist', async () => {
			getByMovieSpy.mockResolvedValue(null);
			await expect(movieService.delete('nonexistent-id')).rejects.toThrow(MovieNotFoundError);
		});
	});

	describe('list method:', () => {
		it('Should return list of movies', async () => {
			const listSpy = jest.spyOn(movieRepository, 'list').mockResolvedValue([movieMockData]);

			const result = await movieService.list();

			expect(result).toEqual([movieMockData]);
			expect(listSpy).toHaveBeenCalled();
		});
	});
});
