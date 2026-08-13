import { prisma } from '@burger-ai/database';
import { generateBurgerCopyPrompt } from '@burger-ai/prompts';
import * as dotenv from 'dotenv';

dotenv.config();

async function pollCopywriterTasks() {
  console.log('Copywriter Agent polling started...');

  setInterval(async () => {
    try {
      const pendingTasks = await prisma.agentTask.findMany({
        where: {
          agent: 'copywriter',
          status: 'PENDING'
        },
        include: {
          campaign: true
        }
      });

      for (const task of pendingTasks) {
        console.log(`Copywriter processing campaign: ${task.campaign.name}`);

        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'RUNNING' }
        });

        // Simulate LLM Call using the prompt library
        const prompt = generateBurgerCopyPrompt({
          theme: task.campaign.theme,
          keyIngredients: ['Pão Brioche', 'Blend Angus 150g', 'Bacon Glaciado', 'Cheddar Inglês']
        });

        console.log(`[Prompt Generated]:\n${prompt}`);

        // Mock LLM result complying with the prompt formatting
        const mockLlmOutput = {
          titulo: `${task.campaign.name} Premium`,
          headline: 'O sabor da brasa com queijo derretido de verdade!',
          descricao: `Um espetáculo gastronômico feito com carne Angus grelhada perfeitamente na brasa, sob generosa cobertura de queijo cheddar inglês fundido e tiras crocantes de bacon glaceado no mel de laranjeira no pão brioche amanteigado tostado.`,
          cta: 'Garanta o seu com desconto exclusivo nas próximas 2 horas! Peça pelo app.',
          hashtags: ['BurgerArtisanal', 'BaconCheddar', 'SmashBurger', 'Delicious']
        };

        // Create the Asset
        await prisma.asset.create({
          data: {
            campaignId: task.campaignId,
            type: 'COPYWRITING',
            content: JSON.stringify(mockLlmOutput)
          }
        });

        // Complete the task
        await prisma.agentTask.update({
          where: { id: task.id },
          data: {
            status: 'COMPLETED',
            output: JSON.stringify(mockLlmOutput)
          }
        });

        console.log(`Copywriter completed task for campaign: ${task.campaignId}`);
      }
    } catch (error: any) {
      console.error('Error in copywriter polling:', error.message);
    }
  }, 5000);
}

pollCopywriterTasks();
