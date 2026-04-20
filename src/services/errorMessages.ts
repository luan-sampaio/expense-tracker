const FALLBACK_ERROR_MESSAGE = 'Não foi possível concluir a operação. Tente novamente.';

export function getUserFacingError(error: unknown) {
  if (!(error instanceof Error)) {
    return FALLBACK_ERROR_MESSAGE;
  }

  if (error.message.includes('Network request failed')) {
    return 'Sem conexão com o servidor. Verifique a rede e tente novamente.';
  }

  if (error.message.includes('Request timeout')) {
    return 'O servidor demorou para responder. Tente novamente em instantes.';
  }

  if (error.message.includes('API error 400')) {
    return 'Algum dado enviado está inválido. Revise as informações.';
  }

  if (error.message.includes('API error 404')) {
    return 'O registro solicitado não foi encontrado no servidor.';
  }

  if (error.message.includes('API error 409')) {
    return 'Esta transação já existe no servidor.';
  }

  if (error.message.includes('API error 5')) {
    return 'O servidor encontrou um problema. Tente novamente mais tarde.';
  }

  return error.message || FALLBACK_ERROR_MESSAGE;
}

