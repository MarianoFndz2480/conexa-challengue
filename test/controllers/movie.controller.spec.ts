import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MovieController } from '@movies/infrastructure/controllers/movie.controller';
import { MovieService } from '@movies/application/services/movie.service';
import { ExecutionContext, INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { MovieAlreadyExistsError, MovieNotFoundError } from '@movies/domain/errors/movie.error';
import { ErrorInterceptor } from '@common/interceptors/error.interceptor';
import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/infrastructure/guards/roles.guard';
import { movieMockData } from '@movies/infrastructure/mock-data/movie.mock-data';
import { Role } from '@auth/domain/enums/role.enum';
import { Request } from 'express';

const notExistingMovieId = '123e4567-e89b-12d3-a456-426614174000';

describe('MovieController integration tests:', () => {
	let app: INestApplication;
	let movieService: MovieService;
	let mockJwtGuardSpy: jest.SpyInstance;

	const mockMovieService = {
		createMovie: jest.fn(),
		getById: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		list: jest.fn(),
	};

	const mockJwtGuard = {
		canActivate: (context: ExecutionContext) => {
			const req = context.switchToHttp().getRequest<Request & { user: { role: Role } }>();
			req.user = { role: Role.ADMIN };
			return true;
		},
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [MovieController],
			providers: [
				{
					provide: MovieService,
					useValue: mockMovieService,
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(mockJwtGuard)
			.overrideGuard(RolesGuard)
			.useClass(RolesGuard)
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		app.useGlobalInterceptors(new ErrorInterceptor());
		await app.init();

		movieService = moduleFixture.get<MovieService>(MovieService);
		mockJwtGuardSpy = jest.spyOn(mockJwtGuard, 'canActivate');
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
		mockJwtGuardSpy.mockClear();
	});

	describe('/movie (POST)', () => {
		it('Should create a movie successfully as ADMIN', async () => {
			const newMovie = {
				title: 'New Movie',
				episodeId: 999,
				openingCrawl: 'Test crawl',
				director: 'Test Director',
				producer: 'Test Producer',
				releaseDate: '2024-01-01',
				url: 'http://test.com',
			};

			jest.spyOn(movieService, 'createMovie').mockResolvedValue({ ...movieMockData, ...newMovie });

			const response = await request(app.getHttpServer() as App)
				.post('/movie')
				.send(newMovie);

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty('id');
		});

		it('Should return 403 when USER tries to create movie', async () => {
			mockJwtGuardSpy.mockImplementationOnce((context: ExecutionContext) => {
				const req = context.switchToHttp().getRequest<Request & { user: { role: Role } }>();
				req.user = { role: Role.USER };
				return true;
			});

			const response = await request(app.getHttpServer() as App)
				.post('/movie')
				.send({
					title: 'New Movie',
					episodeId: 999,
					openingCrawl: 'Test',
					director: 'Test',
					producer: 'Test',
					releaseDate: '2024-01-01',
					url: 'http://test.com',
				});

			expect(response.status).toBe(403);
		});

		it('Should return 409 when movie already exists', async () => {
			jest.spyOn(movieService, 'createMovie').mockRejectedValue(new MovieAlreadyExistsError());

			const response = await request(app.getHttpServer() as App)
				.post('/movie')
				.send({
					title: 'Existing Movie',
					episodeId: 1,
					openingCrawl: 'Test',
					director: 'Test',
					producer: 'Test',
					releaseDate: '2024-01-01',
					url: 'http://test.com',
				});

			expect(response.status).toBe(409);
		});

		it('Should return 401 when no token is provided', async () => {
			mockJwtGuardSpy.mockImplementationOnce(() => {
				throw new UnauthorizedException();
			});

			const response = await request(app.getHttpServer() as App)
				.post('/movie')
				.send({
					title: 'New Movie',
					episodeId: 999,
					openingCrawl: 'Test',
					director: 'Test',
					producer: 'Test',
					releaseDate: '2024-01-01',
					url: 'http://test.com',
				});

			expect(response.status).toBe(401);
		});
	});

	describe('/movie/:id (GET)', () => {
		it('Should return a movie when it exists', async () => {
			jest.spyOn(movieService, 'getById').mockResolvedValue(movieMockData);

			const response = await request(app.getHttpServer() as App).get(`/movie/${movieMockData.id}`);

			expect(response.status).toBe(200);
			expect(response.body).toEqual(movieMockData);
		});

		it('Should return 404 when movie does not exist', async () => {
			jest.spyOn(movieService, 'getById').mockResolvedValue(null);

			const response = await request(app.getHttpServer() as App).get(`/movie/${notExistingMovieId}`);

			expect(response.status).toBe(404);
		});
	});

	describe('/movie/:id (PATCH)', () => {
		it('Should update a movie successfully as ADMIN', async () => {
			const updateData = { title: 'Updated Title' };

			jest.spyOn(movieService, 'update').mockResolvedValue({ ...movieMockData, ...updateData });

			const response = await request(app.getHttpServer() as App)
				.patch(`/movie/${movieMockData.id}`)
				.send(updateData);

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject(updateData);
		});

		it('Should return 403 when USER tries to update movie', async () => {
			mockJwtGuardSpy.mockImplementationOnce((context: ExecutionContext) => {
				const req = context.switchToHttp().getRequest<Request & { user: { role: Role } }>();
				req.user = { role: Role.USER };
				return true;
			});

			const response = await request(app.getHttpServer() as App)
				.patch(`/movie/${movieMockData.id}`)
				.send({ title: 'Updated Title' });

			expect(response.status).toBe(403);
		});

		it('Should return 404 when updating non-existent movie', async () => {
			jest.spyOn(movieService, 'update').mockRejectedValue(new MovieNotFoundError());

			const response = await request(app.getHttpServer() as App)
				.patch(`/movie/${notExistingMovieId}`)
				.send({ title: 'New Title' });

			expect(response.status).toBe(404);
		});

		it('Should return 401 when no token is provided', async () => {
			mockJwtGuardSpy.mockImplementationOnce(() => {
				throw new UnauthorizedException();
			});

			const response = await request(app.getHttpServer() as App)
				.patch(`/movie/${movieMockData.id}`)
				.send({ title: 'Updated Title' });

			expect(response.status).toBe(401);
		});
	});

	describe('/movie/:id (DELETE)', () => {
		it('Should delete a movie successfully as ADMIN', async () => {
			jest.spyOn(movieService, 'delete').mockResolvedValue(undefined);

			const response = await request(app.getHttpServer() as App).delete(`/movie/${movieMockData.id}`);

			expect(response.status).toBe(204);
		});

		it('Should return 403 when USER tries to delete movie', async () => {
			mockJwtGuardSpy.mockImplementationOnce((context: ExecutionContext) => {
				const req = context.switchToHttp().getRequest<Request & { user: { role: Role } }>();
				req.user = { role: Role.USER };
				return true;
			});

			const response = await request(app.getHttpServer() as App).delete(`/movie/${movieMockData.id}`);

			expect(response.status).toBe(403);
		});

		it('Should return 404 when deleting non-existent movie', async () => {
			jest.spyOn(movieService, 'delete').mockRejectedValue(new MovieNotFoundError());

			const response = await request(app.getHttpServer() as App).delete(`/movie/${notExistingMovieId}`);

			expect(response.status).toBe(404);
		});

		it('Should return 401 when no token is provided', async () => {
			mockJwtGuardSpy.mockImplementationOnce(() => {
				throw new UnauthorizedException();
			});

			const response = await request(app.getHttpServer() as App).delete(`/movie/${movieMockData.id}`);

			expect(response.status).toBe(401);
		});
	});

	describe('/movies (GET)', () => {
		it('Should return list of movies for USER role', async () => {
			mockJwtGuardSpy.mockImplementationOnce((context: ExecutionContext) => {
				const req = context.switchToHttp().getRequest<Request & { user: { role: Role } }>();
				req.user = { role: Role.USER };
				return true;
			});

			jest.spyOn(movieService, 'list').mockResolvedValue([movieMockData]);

			const response = await request(app.getHttpServer() as App).get('/movies');

			expect(response.status).toBe(200);
			expect(response.body).toEqual([movieMockData]);
		});

		it('Should return list of movies for ADMIN role', async () => {
			jest.spyOn(movieService, 'list').mockResolvedValue([movieMockData]);

			const response = await request(app.getHttpServer() as App).get('/movies');

			expect(response.status).toBe(200);
			expect(response.body).toEqual([movieMockData]);
		});

		it('Should return 401 when no token is provided', async () => {
			mockJwtGuardSpy.mockImplementationOnce(() => {
				throw new UnauthorizedException();
			});

			const response = await request(app.getHttpServer() as App).get('/movies');

			expect(response.status).toBe(401);
		});
	});
});
