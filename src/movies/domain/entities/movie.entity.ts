export interface Movie {
	id: string;
	title: string;
	episodeId: number;
	openingCrawl: string;
	director: string;
	producer: string;
	releaseDate: string;
	url: string;
	createdAt: Date | string;
	updatedAt: Date | string;
	deletedAt: Date | string | null;
}
