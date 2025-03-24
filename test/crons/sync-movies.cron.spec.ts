import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { SyncMoviesCron } from '@movies/application/crons/syncMovies.cron';
import { MovieService } from '@movies/application/services/movie.service';
import { ExternalMovieRepository } from '@movies/domain/repositories/external-movie.repository';
import { MovieAlreadyExistsError } from '@movies/domain/errors/movie.error';
import { ExternalMovieMockRepository } from '@movies/infrastructure/repositories/external-movie-mock.repository';
import { newMoviesMockData } from '../../src/movies/infrastructure/mock-data/movie.mock-data';

describe('SyncMoviesCron', () => {
	let syncMoviesCron: SyncMoviesCron;
	let movieService: MovieService;
	let externalMovieRepository: ExternalMovieRepository;
	let errorLoggerSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SyncMoviesCron,
				{
					provide: MovieService,
					useValue: {
						createMovie: jest.fn(),
					},
				},
				{
					provide: 'ExternalMovieRepository',
					useClass: ExternalMovieMockRepository,
				},
			],
		}).compile();

		syncMoviesCron = module.get<SyncMoviesCron>(SyncMoviesCron);
		movieService = module.get<MovieService>(MovieService);
		externalMovieRepository = module.get<ExternalMovieRepository>('ExternalMovieRepository');

		errorLoggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => true);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('syncMovies', () => {
		it('should sync movies successfully', async () => {
			jest.spyOn(externalMovieRepository, 'getMovies').mockResolvedValue(newMoviesMockData);
			jest.spyOn(movieService, 'createMovie').mockResolvedValue(undefined);

			await syncMoviesCron.syncMovies();

			expect(externalMovieRepository.getMovies).toHaveBeenCalled();
			expect(movieService.createMovie).toHaveBeenCalledTimes(2);
			expect(movieService.createMovie).toHaveBeenCalledWith(newMoviesMockData[0]);
			expect(movieService.createMovie).toHaveBeenCalledWith(newMoviesMockData[1]);
		});

		it('should handle already existing movies', async () => {
			jest.spyOn(externalMovieRepository, 'getMovies').mockResolvedValue([newMoviesMockData[0]]);
			jest.spyOn(movieService, 'createMovie').mockRejectedValue(new MovieAlreadyExistsError());

			await syncMoviesCron.syncMovies();

			expect(errorLoggerSpy).not.toHaveBeenCalled();
		});

		it('should handle movie creation errors', async () => {
			const error = new Error('Database connection failed');
			jest.spyOn(externalMovieRepository, 'getMovies').mockResolvedValue([newMoviesMockData[0]]);
			jest.spyOn(movieService, 'createMovie').mockRejectedValue(error);

			await syncMoviesCron.syncMovies();

			expect(errorLoggerSpy).toHaveBeenCalledWith(
				`Error syncing movie ${newMoviesMockData[0].title}: ${error.message}`,
			);
		});

		it('should handle external API errors', async () => {
			const error = new Error('API connection failed');
			jest.spyOn(externalMovieRepository, 'getMovies').mockRejectedValue(error);

			await syncMoviesCron.syncMovies();

			expect(errorLoggerSpy).toHaveBeenCalledWith(`Synchronization failed: ${error.message}`);
		});
	});
});
