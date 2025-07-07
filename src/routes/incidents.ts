import express, { Request, Response } from 'express';
import Incident from '../models/Incident';
import { authenticate } from '../middleware/auth';
import { openai } from '../config/openai';

const router = express.Router();

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user;

    try {
      const incidents = await Incident.findAll({
        where: { userId: user.uid },
        order: [["createdAt", "DESC"]],
      });

      res.json(incidents);
    } catch (err) {
      console.error("Error fetching incidents:", err);
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  }
);

router.post(
  '/',
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const { type, description } = req.body;
    const user = (req as any).user;

    if (!type || !description) {
      res.status(400).json({ error: 'Type and description are required' });
      return;
    }

    try {
      const incident = await Incident.create({
        userId: user.uid,
        type,
        description,
      });

      res.status(201).json(incident);
    } catch (err) {
      console.error('Error creating incident:', err);
      res.status(500).json({ error: 'Failed to create incident' });
    }
  }
);

router.post(
  '/:id/summarize',
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = (req as any).user;

    try {
      const incident = await Incident.findOne({
        where: { id, userId: user.uid },
      });

      if (!incident) {
        res.status(404).json({ error: 'Incident not found' });
        return;
      }

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a nursing supervisor summarising incident reports in one concise sentence.',
          },
          {
            role: 'user',
            content: incident.description,
          },
        ],
        max_tokens: 60,
        temperature: 0.4,
      });

      const summary = completion.choices[0].message.content?.trim() || '';

      incident.summary = summary;
      await incident.save();

      res.json(incident);
    } catch (err) {
      console.error('OpenAI / summarise error:', err);
      res.status(500).json({ error: 'Failed to summarise incident' });
    }
  }
);

export default router;