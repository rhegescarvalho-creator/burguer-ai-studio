import { prisma } from '@burger-ai/database';
import * as dotenv from 'dotenv';

dotenv.config();

async function pollSocialMediaTasks() {
  console.log('Social Media Agent polling started...');

  setInterval(async () => {
    try {
      const pendingTasks = await prisma.agentTask.findMany({
        where: {
          agent: 'social-media',
          status: 'PENDING'
        },
        include: {
          campaign: true
        }
      });

      for (const task of pendingTasks) {
        console.log(`Social media processing campaign: ${task.campaign.name}`);

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

        const socialPost = {
          platform: 'instagram',
          format: 'feed-square',
          mediaUrl: imgAsset?.url || '',
          caption: copyData?.instagramCaption || ''
        };

        // Create the SOCIAL_POST Asset
        await prisma.asset.create({
          data: {
            campaignId: task.campaignId,
            type: 'SOCIAL_POST',
            content: JSON.stringify(socialPost)
          }
        });

        // Complete the task
        await prisma.agentTask.update({
          where: { id: task.id },
          data: {
            status: 'COMPLETED',
            output: JSON.stringify(socialPost)
          }
        });

        console.log(`Social media completed task for campaign: ${task.campaignId}`);
      }
    } catch (error: any) {
      console.error('Error in social media polling:', error.message);
    }
  }, 5000);
}

pollSocialMediaTasks();
