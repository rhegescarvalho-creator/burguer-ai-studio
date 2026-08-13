export const copywriterSystemPrompt = `Você é um Copywriter especialista em gastronomia e hamburguerias artesanais.
Sua missão é criar nomes de hambúrgueres extremamente apetitosos, descrições que façam dar água na boca e legendas de redes sociais altamente engajadoras.
Use palavras sensoriais (crocante, suculento, derretido, defumado) e adote um tom moderno, informal e irresistível.`;

export interface GenerateBurgerCopyInput {
  theme: string;
  keyIngredients: string[];
  burgerName?: string;
}

export function generateBurgerCopyPrompt({ theme, keyIngredients, burgerName }: GenerateBurgerCopyInput): string {
  const ingredientsList = keyIngredients.join(', ');
  return `Crie material promocional para um hambúrguer baseado no tema "${theme}".
${burgerName ? `Nome do Hambúrguer: ${burgerName}` : 'Crie um nome criativo e comercial para este hambúrguer.'}
Ingredientes chave: ${ingredientsList}.

Por favor, retorne no seguinte formato JSON:
{
  "titulo": "Nome sugerido (Título)",
  "headline": "Frase curta de efeito (Headline)",
  "descricao": "Descrição sensorial detalhada (Descrição)",
  "cta": "Chamada para ação irresistível (CTA)",
  "hashtags": ["lista", "de", "hashtags", "relevantes"]
}`;
}
