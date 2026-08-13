import { prisma } from '@burger-ai/database';
import * as dotenv from 'dotenv';

dotenv.config();

// Array of premium burger photography mock urls for demonstration
const mockImageUrls = [
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'
];

async function pollImageGeneratorTasks() {
  console.log('Image Generator Agent polling started...');

  setInterval(async () => {
    try {
      const pendingTasks = await prisma.agentTask.findMany({
        where: {
          agent: 'image-generator',
          status: 'PENDING'
        },
        include: {
          campaign: true
        }
      });

      for (const task of pendingTasks) {
        console.log(`Image generator processing campaign: ${task.campaign.name}`);

        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'RUNNING' }
        });

        // Find the photographer's output
        const photoTask = await prisma.agentTask.findFirst({
          where: {
            campaignId: task.campaignId,
            agent: 'food-photographer',
            status: 'COMPLETED'
          }
        });

        const promptConfig = photoTask?.output ? JSON.parse(photoTask.output as string)?.promptConfig : null;
        const imagePrompt = promptConfig?.imagePrompt || 'double cheeseburger, dark studio background';

        console.log(`[Executing Image Generation prompt]: ${imagePrompt}`);

        // Simulate 2 second API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const selectedImage = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];

        // Create the IMAGE Asset
        await prisma.asset.create({
          data: {
            campaignId: task.campaignId,
            type: 'IMAGE',
            url: selectedImage,
            metadata: JSON.stringify({
              promptUsed: imagePrompt,
              engine: 'Midjourney v6'
            })
          }
        });

        // Complete the task
        await prisma.agentTask.update({
          where: { id: task.id },
          data: {
            status: 'COMPLETED',
            output: JSON.stringify({
              imageUrl: selectedImage
            })
          }
        });

        console.log(`Image generator completed task for campaign: ${task.campaignId}`);
      }
    } catch (error: any) {
      console.error('Error in image generator polling:', error.message);
    }
  }, 5000);
}

pollImageGeneratorTasks();
