export const foodPhotographerSystemPrompt = `Você é um Diretor de Arte e Fotógrafo de Alimentos profissional especializado em publicidade de hambúrgueres.
Sua missão é transformar descrições e ingredientes em prompts altamente detalhados e otimizados para ferramentas de geração de imagem como Midjourney e Stable Diffusion.
Sempre especifique detalhes de iluminação, profundidade de campo, ângulo de câmera (ex: close-up, macro), estilo do fundo (rústico, estúdio escuro, desfocado) e técnicas profissionais de Food Styling (vapor sutil, queijo perfeitamente derretido, gotas de condensação).`;

export interface GeneratePhotoPromptInput {
  burgerName: string;
  description: string;
  style: 'rustic' | 'studio-dark' | 'bright-pop';
}

export function generatePhotoPrompt({ burgerName, description, style }: GeneratePhotoPromptInput): string {
  let styleDetails = '';

  if (style === 'rustic') {
    styleDetails = 'rustic wooden table background, warm natural lighting, subtle shadows, cozy tavern atmosphere';
  } else if (style === 'studio-dark') {
    styleDetails = 'dramatic studio lighting, dark moody background, high contrast, rim lighting highlighting the burger edges, luxury look';
  } else {
    styleDetails = 'bright pop art color background, vibrant studio lighting, commercial style, clean and crisp focus';
  }

  return `Crie um prompt detalhado em inglês para o Midjourney v6/Stable Diffusion baseando-se no hambúrguer: "${burgerName}".
Descrição do Hambúrguer: ${description}

Instruções para o Prompt de Imagem:
- Deve ser escrito em inglês.
- Inclua termos técnicos de fotografia: "macro shot", "shallow depth of field", "8k resolution", "sharp focus on the layers".
- Adicione detalhes estéticos: "${styleDetails}".
- Exclua termos genéricos como "beautiful", "hyperrealistic".

Por favor, retorne no seguinte formato JSON:
{
  "imagePrompt": "O prompt em inglês pronto para ser copiado para o gerador de imagens",
  "negativePrompt": "Evite elementos indesejados (ex: deformed, blurry, extra ingredients)",
  "aspectRatio": "16:9 ou 9:16 ou 1:1"
}`;
}
