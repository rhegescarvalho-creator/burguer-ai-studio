import { prisma } from '@burger-ai/database';
import * as dotenv from 'dotenv';

dotenv.config();

async function pollOrchestratorTasks() {
  console.log('Orchestrator Agent started polling...');
  
  // Simple loop simulation for polling database tasks
  setInterval(async () => {
    try {
      const pendingTasks = await prisma.agentTask.findMany({
        where: {
          agent: 'orchestrator',
          status: 'PENDING'
        }
      });

      for (const task of pendingTasks) {
        console.log(`Processing orchestration request for campaign ID: ${task.campaignId}`);
        
        // Update task status to RUNNING
        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'RUNNING' }
        });

        await prisma.campaign.update({
          where: { id: task.campaignId },
          data: { status: 'GENERATING' }
        });

        // Trigger individual agent tasks sequentially (simulation)
        const agentPipeline: string[] = [
          'copywriter',
          'food-photographer',
          'image-generator',
          'video-director',
          'tv-builder',
          'social-media',
          'publisher'
        ];

        for (const agent of agentPipeline) {
          console.log(`Scheduling task for agent: ${agent}`);
          await prisma.agentTask.create({
            data: {
              campaignId: task.campaignId,
              agent,
              status: 'PENDING'
            }
          });
        }

        // Mark Orchestration task as COMPLETED
        await prisma.agentTask.update({
          where: { id: task.id },
          data: {
            status: 'COMPLETED',
            output: JSON.stringify({ pipelineCreated: true, agentsCount: agentPipeline.length })
          }
        });

        console.log(`Orchestration task ${task.id} completed successfully.`);
      }
    } catch (error: any) {
      console.error('Error in Orchestrator polling:', error.message);
    }
  }, 5000);
}

pollOrchestratorTasks();
