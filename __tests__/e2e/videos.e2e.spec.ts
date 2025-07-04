import express from 'express';
import request from 'supertest';
import { HttpStatus } from '../../src/core/types/http-statuses';
import { db } from '../../src/db/in-memory.db';
import { setupApp } from "../../src/setup-app";
import { availableResolutions } from '../../src/videos/types/videos';

describe.only('Videos API', () => {
	const app = express();
	setupApp(app);

    beforeAll(async () => {
		await request(app)
		.delete('/api/testing/all-data')
		.expect(HttpStatus.NoContent);
	});

    it('should return videos list; GET /api/videos', async () => {
        const response = await request(app).get('/api/videos');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // Проверим структуру первого видео, если оно есть
        if (response.body.length > 0) {
          const video = response.body[0];
          expect(video).toHaveProperty('id');
          expect(video).toHaveProperty('title');
          expect(video).toHaveProperty('author');
          expect(video).toHaveProperty('canBeDownloaded');
          expect(video).toHaveProperty('minAgeRestriction');
          expect(video).toHaveProperty('createdAt');
          expect(video).toHaveProperty('publicationDate');
          expect(video).toHaveProperty('availableResolutions');
        }  
    });

    it('should create video; POST /api/videos', async () => {
        const response = await request(app).post('/api/videos').send({
            title: 'Test Video',
            author: 'Test Author',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            createdAt: new Date(),
            publicationDate: new Date().toISOString(),
            availableResolutions: [availableResolutions.P144],
        })
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('author');
        expect(response.body).toHaveProperty('canBeDownloaded');
        expect(response.body).toHaveProperty('minAgeRestriction');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('publicationDate');
        expect(response.body).toHaveProperty('availableResolutions');
    });

    it('should create and get video; POST /api/videos', async () => {
        await request(app).post('/api/videos').send({
            title: 'Test Video',
            author: 'Test Author',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            createdAt: new Date(),
            publicationDate: new Date().toISOString(),
            availableResolutions: [availableResolutions.P144],
        })
        const response = await request(app).get('/api/videos');
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return video by id; GET /api/videos/:id', async () => {
        const response = await request(app).get('/api/videos/3');
        expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing video', async () => {
        const response = await request(app).get('/api/videos/999');
        expect(response.status).toBe(404);
    });

    it('should delete video; DELETE /api/videos/:id', async () => {
        const response = await request(app).delete('/api/videos/3');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing video', async () => {
        const response = await request(app).delete('/api/videos/999');
        expect(response.status).toBe(404);
    });

    it('should create and update video', async () => {
        // Сначала создаём видео
        const createRes = await request(app).post('/api/videos').send({
            title: 'Test Video',
            author: 'Test Author',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: ['P144'],
        });
        const videoId = createRes.body.id;

        // Теперь обновляем это видео
        const updateRes = await request(app).put(`/api/videos/${videoId}`).send({
            title: 'Updated Video',
            author: 'Test Author',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: ['P144'],
        });
        expect(updateRes.status).toBe(204);
    });
})