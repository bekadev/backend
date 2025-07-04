import { Request, Response, Router } from 'express';
import {db} from "../../db/in-memory.db";
import { videoInputDtoValidation } from '../validation/videoInputDtoValidation';
import { createErrorMessages } from '../../core/utils/error.utils';

export const videosRouter = Router({});

videosRouter.get('', (req: Request, res: Response) => {
			res.status(200).send(db.videos)
	})

videosRouter.post('', (req: Request, res: Response) => {
	const newVideo = {
		id: db.videos.length + 1,
		title: req.body.title,
		author: req.body.author,
		canBeDownloaded: req.body.canBeDownloaded,
		minAgeRestriction: req.body.minAgeRestriction,
		createdAt: new Date(),
		publicationDate: req.body.publicationDate,
		availableResolutions: req.body.availableResolutions,
	}
	// db.videos.push(...db.videos, newVideo)

	db.videos = [...db.videos, newVideo]


	res.status(201).send(newVideo)
})

videosRouter.get('/:id', (req: Request, res: Response) => {
	const video = db.videos.find((v) => v.id === +req.params.id)
	if (!video) {
		res.status(404).send()
	}
	res.status(200).send(video)
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
	const video = db.videos.find((v) => v.id === +req.params.id)
	if (!video) {
		res.status(404).send()
	}
	db.videos = db.videos.filter((v) => v.id !== +req.params.id)
	res.status(204).send()
})

videosRouter.put('/:id', (req: Request, res: Response) => {
	const id = +req.params.id;
	const index = db.videos.findIndex((v) => v.id === id);

	if (index === -1) {
		res.status(404).send(createErrorMessages([
			{ field: 'id', message: 'Vehicle not found' },
		]),);
		return;
	}

	const errors = videoInputDtoValidation(req.body);
	if (errors.length > 0) {
		 res.status(400).json({ errorsMessages: errors });
		 return
	}

	const video = db.videos[index];

	
	video.title = req.body.title;
	video.author = req.body.author;
	video.canBeDownloaded = req.body.canBeDownloaded;
	video.minAgeRestriction = req.body.minAgeRestriction;
	video.createdAt = req.body.createdAt;
	video.publicationDate = req.body.publicationDate;
	video.availableResolutions = req.body.availableResolutions;

	res.sendStatus(204);
})