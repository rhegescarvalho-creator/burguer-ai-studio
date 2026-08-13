import { prisma } from '@burger-ai/database';
import * as dotenv from 'dotenv';

dotenv.config();

async function pollTvBuilderTasks() {
  console.log('TV Builder Agent polling started...');

  setInterval(async () => {
    try {
      const pendingTasks = await prisma.agentTask.findMany({
        where: {
          agent: 'tv-builder',
          status: 'PENDING'
        },
        include: {
          campaign: true
        }
      });

      for (const task of pendingTasks) {
        console.log(`TV builder processing campaign: ${task.campaign.name}`);

        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'RUNNING' }
        });

        // Find copywriting and image
        const copyAsset = await prisma.asset.findFirst({
          where: { campaignId: task.campaignId, type: 'COPYWRITING' }
        });
        const imgAsset = await prisma.asset.findFirst({
          where: { campaignId: task.campaignId, type: 'IMAGE' }
        });

        const copyData = copyAsset && copyAsset.content ? JSON.parse(copyAsset.content) : null;

        const tvLayout = {
          template: 'standard-landscape-tv',
          resolution: '1920x1080',
          widgets: [
            { type: 'hero-image', url: imgAsset?.url || '', position: { x: 0, y: 0, w: 1200, h: 1080 } },
            { type: 'product-info', name: copyData?.name || task.campaign.name, tagline: copyData?.tagline || '', price: 'R$ 38,90', position: { x: 1200, y: 0, w: 720, h: 1080 } }
          ],
          transitionDurationMs: 5000
        };

        // Create the TV_BOARD Asset
        await prisma.asset.create({
          data: {
            campaignId: task.campaignId,
            type: 'TV_BOARD',
            content: JSON.stringify(tvLayout)
          }
        });

        // Complete the task
        await prisma.agentTask.update({
          where: { id: task.id },
          data: {
            status: 'COMPLETED',
            output: JSON.stringify(tvLayout)
          }
        });

        console.log(`TV builder completed task for campaign: ${task.campaignId}`);
      }
    } catch (error: any) {
      console.error('Error in TV builder polling:', error.message);
    }
  }, 5000);
}

pollTvBuilderTasks();
