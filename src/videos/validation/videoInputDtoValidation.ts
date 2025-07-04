import { ValidationError } from '../../drivers/types/validationError';

export const videoInputDtoValidation = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  const {
    title,
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
    publicationDate,
  } = data;

  if (!title || typeof title !== 'string' || title.length < 1 || title.length > 40) {
    errors.push({ field: 'title', message: 'Invalid title' });
  }
  if (!author || typeof author !== 'string' || author.length < 1 || author.length > 20) {
    errors.push({ field: 'author', message: 'Invalid author' });
  }
  if (!Array.isArray(availableResolutions) ||
    availableResolutions.some((r) => !['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'].includes(r))) {
    errors.push({ field: 'availableResolutions', message: 'Invalid availableResolutions' });
  }
  if (typeof canBeDownloaded !== 'boolean') {
    errors.push({ field: 'canBeDownloaded', message: 'canBeDownloaded must be boolean' });
  }
  if (minAgeRestriction !== null && (typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18)) {
    errors.push({ field: 'minAgeRestriction', message: 'minAgeRestriction must be null or number 1-18' });
  }
  if (!publicationDate || isNaN(Date.parse(publicationDate))) {
    errors.push({ field: 'publicationDate', message: 'publicationDate must be a valid ISO date string' });
  }

  return errors;
}; 