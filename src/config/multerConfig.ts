import * as multer from 'multer';
import { randomBytes } from 'crypto';

import serverConfig from './serverConfig';

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, serverConfig.dir.uploadFiles);
    },
    filename: (req, file, cb) => {
      randomBytes(16, (err, hash) => {
        if (err) cb(err, file.filename);

        const parts = file.originalname.split('.');
        const extension = parts[parts.length - 1];

        file.originalname = `${hash.toString('hex')}.${extension}`;

        cb(null, file.originalname);
      });
    },
  }),
};

export default {
  dest: serverConfig.dir.uploadFiles,
  storage: storageTypes.local,
  limits: {
    fileSize: 2 * 4096 * 4096,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gi',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'), false);
    }
  },
} as multer.Options;
