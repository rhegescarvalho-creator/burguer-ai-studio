export interface UserSession {
  userId: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR';
}

export function generateMockToken(user: UserSession): string {
  const payload = Buffer.from(JSON.stringify(user)).toString('base64');
  return `mock_jwt_token_${payload}.${Date.now() + 24 * 60 * 60 * 1000}`;
}

export function verifyMockToken(token: string): UserSession | null {
  if (!token.startsWith('mock_jwt_token_')) {
    return null;
  }
  
  try {
    const parts = token.split('.');
    const payloadPart = parts[0].replace('mock_jwt_token_', '');
    const decoded = Buffer.from(payloadPart, 'base64').toString('utf-8');
    return JSON.parse(decoded) as UserSession;
  } catch {
    return null;
  }
}
