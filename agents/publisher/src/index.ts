import { prisma } from '@burger-ai/database';
import * as dotenv from 'dotenv';

dotenv.config();

async function pollPublisherTasks() {
  console.log('Publisher Agent polling started...');

  setInterval(async () => {
    try {
      const pendingTasks = await prisma.agentTask.findMany({
        where: {
          agent: 'publisher',
          status: 'PENDING'
        },
        include: {
          campaign: true
        }
      });

      for (const task of pendingTasks) {
        console.log(`Publisher processing campaign: ${task.campaign.name}`);

        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'RUNNING' }
        });

        // Simulate publishing pipeline (e.g. S3 file uploads, social APIs hook)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update campaign status to READY/PUBLISHED
        await prisma.campaign.update({
          where: { id: task.campaignId },
          data: { status: 'READY' }
        });

        // Complete the task
        await prisma.agentTask.update({
          where: { id: task.id },
          data: {
            status: 'COMPLETED',
            output: JSON.stringify({
              published: true,
              publishedAt: new Date()
            })
          }
        });

        console.log(`Publisher completed task. Campaign ${task.campaign.name} is now READY.`);
      }
    } catch (error: any) {
      console.error('Error in publisher polling:', error.message);
    }
  }, 5000);
}

pollPublisherTasks();
