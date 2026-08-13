import { prisma } from '@burger-ai/database';
import * as dotenv from 'dotenv';

dotenv.config();

async function pollVideoDirectorTasks() {
  console.log('Video Director Agent polling started...');

  setInterval(async () => {
    try {
      const pendingTasks = await prisma.agentTask.findMany({
        where: {
          agent: 'video-director',
          status: 'PENDING'
        },
        include: {
          campaign: true
        }
      });

      for (const task of pendingTasks) {
        console.log(`Video director processing campaign: ${task.campaign.name}`);

        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'RUNNING' }
        });

        // Generate storyboard steps
        const storyboard = [
          { scene: 1, duration: 3, description: 'Fumaça subindo lentamente em fundo escuro com brasas' },
          { scene: 2, duration: 4, description: 'Super close no queijo cheddar derretendo pelas laterais do blend duplo' },
          { scene: 3, duration: 3, description: 'Tiras de bacon estalando crocantes sobre o cheddar' },
          { scene: 4, duration: 5, description: 'Logotipo Smash & Co. com a chamada: Peça hoje mesmo pelo site!' }
        ];

        console.log(`[Video Storyboard Compiled]:`, JSON.stringify(storyboard, null, 2));

        const mockVideoUrl = '/video.mp4'; // Local placeholder video

        // Create the VIDEO Asset
        await prisma.asset.create({
          data: {
            campaignId: task.campaignId,
            type: 'VIDEO',
            url: mockVideoUrl,
            metadata: JSON.stringify({
              storyboard,
              durationSeconds: 15
            })
          }
        });

        // Complete the task
        await prisma.agentTask.update({
          where: { id: task.id },
          data: {
            status: 'COMPLETED',
            output: JSON.stringify({
              videoUrl: mockVideoUrl,
              storyboard
            })
          }
        });

        console.log(`Video director completed task for campaign: ${task.campaignId}`);
      }
    } catch (error: any) {
      console.error('Error in video director polling:', error.message);
    }
  }, 5000);
}

pollVideoDirectorTasks();
