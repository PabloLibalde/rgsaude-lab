import * as path from 'path';
import host from './hostConfig';

const port = 6581;

export default {
  host: host.ip,
  port,
  baseUrl: `http://${host.ip}:${port}`,
  dir: {
    userAvatar: path.resolve(__dirname, '..', '..', 'images', 'avatar'),
    information: path.resolve(__dirname, '..', '..', 'images', 'informacao'),
    uploadFiles: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  },
  path: {
    userAvatar: 'images/avatar',
    information: 'images/informacao',
    uploadFiles: 'tmp/uploads',
  },
};
