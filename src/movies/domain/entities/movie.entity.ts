export interface Movie {
	id: string;
	title: string;
	episodeId: number;
	openingCrawl: string;
	director: string;
	producer: string;
	releaseDate: string;
	url: string;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
}
