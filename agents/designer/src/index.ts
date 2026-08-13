import { prisma } from '@burger-ai/database';
import { generatePhotoPrompt } from '@burger-ai/prompts';
import * as dotenv from 'dotenv';

dotenv.config();

async function pollPhotographerTasks() {
  console.log('Food Photographer Agent polling started...');

  setInterval(async () => {
    try {
      const pendingTasks = await prisma.agentTask.findMany({
        where: {
          agent: 'food-photographer',
          status: 'PENDING'
        },
        include: {
          campaign: true
        }
      });

      for (const task of pendingTasks) {
        console.log(`Food photographer processing campaign: ${task.campaign.name}`);

        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'RUNNING' }
        });

        // Find copywriting asset for details
        const copyAsset = await prisma.asset.findFirst({
          where: {
            campaignId: task.campaignId,
            type: 'COPYWRITING'
          }
        });

        const copyData = copyAsset && copyAsset.content ? JSON.parse(copyAsset.content) : null;
        const burgerName = copyData?.name || task.campaign.name;
        const description = copyData?.description || task.campaign.theme;

        const photoPromptResult = generatePhotoPrompt({
          burgerName,
          description,
          style: 'studio-dark'
        });

        console.log(`[Photography Prompts Generated]:\n`, JSON.stringify(photoPromptResult, null, 2));

        // Update task output
        await prisma.agentTask.update({
          where: { id: task.id },
          data: {
            status: 'COMPLETED',
            output: JSON.stringify({
              promptConfig: photoPromptResult
            })
          }
        });

        console.log(`Food photographer completed task for campaign: ${task.campaignId}`);
      }
    } catch (error: any) {
      console.error('Error in food photographer polling:', error.message);
    }
  }, 5000);
}

pollPhotographerTasks();
