import { Request, Response } from 'express';

class HomeController {
  public index(req: Request, res: Response): Response {
    console.log('fetch at', new Date());

    return res.status(200).json({ message: 'connected at rg-saude-mobile' });
  }
}

export default new HomeController();
