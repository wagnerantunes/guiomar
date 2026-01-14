/**
 * Utilitário para formatação de datas no fuso horário de Brasília
 */

/**
 * Converte uma data UTC para o horário de Brasília (UTC-3)
 * @param date Data em UTC
 * @returns Data formatada no horário de Brasília
 */
export function toBrasiliaTime(date: Date | string): Date {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Date(d.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
}

/**
 * Formata uma data para exibição no formato brasileiro com horário de Brasília
 * @param date Data a ser formatada
 * @param includeTime Se deve incluir o horário (padrão: true)
 * @returns String formatada
 */
export function formatBrasiliaDate(date: Date | string, includeTime: boolean = true): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...(includeTime && {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }),
    };

    return d.toLocaleString('pt-BR', options);
}

/**
 * Formata uma data de forma relativa (ex: "há 2 horas", "ontem")
 * @param date Data a ser formatada
 * @returns String formatada de forma relativa
 */
export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'agora mesmo';
    if (diffMin < 60) return `há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
    if (diffHour < 24) return `há ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
    if (diffDay === 1) return 'ontem';
    if (diffDay < 7) return `há ${diffDay} dias`;
    if (diffDay < 30) return `há ${Math.floor(diffDay / 7)} semana${Math.floor(diffDay / 7) > 1 ? 's' : ''}`;
    if (diffDay < 365) return `há ${Math.floor(diffDay / 30)} mês${Math.floor(diffDay / 30) > 1 ? 'es' : ''}`;
    return `há ${Math.floor(diffDay / 365)} ano${Math.floor(diffDay / 365) > 1 ? 's' : ''}`;
}

/**
 * Retorna o horário atual de Brasília
 * @returns Data atual no horário de Brasília
 */
export function nowBrasilia(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
}
