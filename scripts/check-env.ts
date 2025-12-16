#!/usr/bin/env bun

/**
 * Script de verificação do ambiente
 * Verifica se todas as variáveis de ambiente necessárias estão configuradas
 */

const requiredEnvVars = [
	'PUBLIC_SUPABASE_URL',
	'PUBLIC_SUPABASE_ANON_KEY',
	'PUBLIC_TURNSTILE_SITE_KEY'
];

console.log('🔍 Verificando configuração do ambiente...\n');

let hasErrors = false;

for (const envVar of requiredEnvVars) {
	const value = process.env[envVar];
	
	if (!value) {
		console.error(`❌ ${envVar} não está definida`);
		hasErrors = true;
	} else if (value.includes('seu') || value.includes('sua') || value.includes('aqui')) {
		console.warn(`⚠️  ${envVar} parece estar com valor de exemplo`);
		hasErrors = true;
	} else {
		console.log(`✅ ${envVar} está configurada`);
	}
}

console.log('');

if (hasErrors) {
	console.error('❌ Configuração incompleta!');
	console.log('\n📝 Passos para corrigir:');
	console.log('1. Copie o arquivo .env.local.example para .env');
	console.log('2. Preencha as variáveis com suas credenciais');
	console.log('3. Consulte o SETUP.md para mais detalhes\n');
	process.exit(1);
} else {
	console.log('✅ Todas as variáveis de ambiente estão configuradas!');
	console.log('🚀 Você pode iniciar o servidor com: bun run dev\n');
	process.exit(0);
}

